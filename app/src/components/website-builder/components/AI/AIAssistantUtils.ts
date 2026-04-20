/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file AIAssistantUtils.ts
 *
 * Utilities for transforming an AI backend response into user-reviewable "atomic" changes
 * and applying those changes safely to a GrapesJS editor instance.
 *
 * Main responsibilities:
 * - Convert backend output `{ component?, styles? }` into `AIChange[]` with `enabled` flags
 * - Find the correct target component reliably (HTML id vs model id vs cid)
 * - Apply changes selectively (only enabled ones)
 * - Apply style changes as CSS rules (preferred) with fallbacks
 *
 * Notes on GrapesJS:
 * - GrapesJS component "model id" is not always the same as the rendered HTML `id=""`
 * - Some GrapesJS versions differ in APIs (CssComposer, addStyle, replace behaviors)
 */

import { v4 as uuidv4 } from "uuid";
import { AIChange } from "./types.ts";
import {Editor} from "grapesjs";

/**
 * Escapes an ID for safe usage in a CSS selector (e.g. `#<id>`).
 * This is a minimal escaping to cover common problematic characters.
 *
 * @param id - The raw id value.
 * @returns Escaped id string safe to be used in CSS selectors.
 */
function escapeCssId(id: string): string {
    return String(id).replace(/([ #;?%&,.+*~\\':"!^$\[\]()=>|/@])/g, "\\$1");
}

/**
 * Walks a GrapesJS component tree depth-first and executes a callback on each component.
 * Stops early if the callback returns true.
 *
 * @param root - Root component model (usually `editor.getWrapper()`).
 * @param cb - Callback executed for each component. Return true to stop traversal.
 * @returns True if traversal was stopped early (component found), otherwise false.
 */
function walkComponents(root: any, cb: (cmp: any) => boolean): boolean {
    if (!root) {
        return false;
    }
    if (cb(root)){
        return true;
    }

    const children = typeof root.components === "function" ? root.components() : null;
    if (!children) {
        return false;
    }

    if (typeof children.forEach === "function") {
        let found = false;
        children.forEach((c: any) => {
            if (found){
                return;
            }
            if (walkComponents(c, cb)) {
                found = true;
            }
        });
        return found;
    }

    return false;
}

/**
 * Handles the find component by any id operation.
 *
 * @param {any} editor - The editor value.
 * @param {any} targetId: string): any | null {
    const wrapper = editor?.getWrapper?.();
    if (!wrapper || !targetId - The target id: string): any | null {
    const wrapper = editor?.get wrapper?.();
    if (!wrapper || !target id value.
 */
function findComponentByAnyId(editor: any, targetId: string): any | null {
    const wrapper = editor?.getWrapper?.();
    if (!wrapper || !targetId) {
        return null;
    }

    // 1) Try CSS selector lookup by HTML id
    const css = `#${escapeCssId(targetId)}`;
    const byCss = wrapper?.find?.(css)?.[0];
    if (byCss){
        return byCss;
    }

    // 2) Fallback: traverse models (covers cases where getId() != HTML id)
    let found: any = null;
    walkComponents(wrapper, (cmp) => {
        const attrs =
            typeof cmp?.getAttributes === "function"
                ? cmp.getAttributes()
                : cmp?.get?.("attributes") || {};

        const attrId = attrs?.id;
        const modelId = typeof cmp?.getId === "function" ? cmp.getId() : cmp?.get?.("id");
        const cid = cmp?.cid;

        if (attrId === targetId || modelId === targetId || cid === targetId) {
            found = cmp;
            return true;
        }
        return false;
    });

    return found;
}

/**
 * Public helper used by other modules (e.g. preview rendering) to locate the change target.
 *
 * @param editor - GrapesJS editor instance.
 * @param targetId - Target id.
 * @returns Target component model or null.
 */
export function findAIChangeTarget(editor: any, targetId: string): any | null {
    return findComponentByAnyId(editor, targetId);
}

/**
 * Converts camelCase style keys to kebab-case CSS properties.
 * If the prop already contains "-", it is returned unchanged.
 *
 * @param prop - Style property name.
 * @returns Kebab-case property name.
 */
function toKebabCase(prop: string): string {
    if (prop.includes("-")){
        return prop;
    }
    return prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

/**
 * Converts a style object to a CSS declaration string.
 * Filters out empty values (undefined, null, "").
 *
 * @param style - Style object.
 * @returns CSS declaration string (e.g. `font-size:16px;padding:10px;`).
 */
function styleObjToCss(style: Record<string, any>): string {
    return Object.entries(style || {})
        .filter(([k, v]) => k && v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${toKebabCase(String(k))}:${String(v)};`)
        .join("");
}

/**
 * Handles the apply css rule operation.
 *
 * @param {any} editor - The editor value.
 * @param {any} selector - The selector value.
 * @param {any} style - The style value.
 * @param {any} any>): void {
    if (!editor || !selector) return;

    const cc = editor.CssComposer;

    try {
        // Preferred API
        if (cc?.setRule - The any>): void {
    if (!editor || !selector) return;

    const cc = editor.css composer;

    try {
        // preferred api
        if (cc?.set rule value.
 */
function applyCssRule(editor: Editor, selector: string, style: Record<string, any>): void {
    if (!editor || !selector) return;

    const cc = editor.CssComposer;

    try {
        // Preferred API
        if (cc?.setRule) {
            cc.setRule(selector, style);
            return;
        }
        // Common alternative API
        if (cc?.getRule && cc?.add) {
            let rule = cc.getRule(selector) ?? cc.add(selector);
            if (rule?.setStyle) rule.setStyle(style);
            return;
        }
    } catch {
        // Ignore and use fallbacks below
    }

    // Fallback 1: inject raw CSS string
    const cssBody = styleObjToCss(style);
    if (!cssBody) return;

    const css = `${selector}{${cssBody}}`;
    if (typeof editor.addStyle === "function") {
        editor.addStyle(css);
        return;
    }

    // Fallback 2: apply as inline styles on matching components (least reliable)
    const wrapper = editor.getWrapper?.();
    const componentsToStyle = wrapper?.find?.(selector) || [];
    componentsToStyle.forEach((cmp: any) => {
        if (cmp?.setStyle) cmp.setStyle(style);
    });
}

/**
 * Turns a backend AI response into user-reviewable atomic changes.
 *
 * Current strategy:
 * - 1x "component" change that replaces the selected component root
 * - Nx "style" changes (one change per styles block returned)
 *
 * Expected backend response shape:
 * ```ts
 * {
 *   component?: any,
 *   styles?: Array<{ selectors?: string[], style?: Record<string, unknown> }>
 * }
 * ```
 *
 * @param res - Backend response.
 * @param targetId - The id of the selected component (target of the component replacement).
 * @returns Array of atomic AIChange objects.
 */
export function buildAIChanges(res: any, targetId: string): AIChange[] {
    const changes: AIChange[] = [];

    // Component replacement change
    if (res?.component) {
        changes.push({
            id: uuidv4(),
            type: "component",
            enabled: true,
            label: "Replace component structure",
            targetId,
            component: res.component,
        });
    }

    // Style changes
    const styles = Array.isArray(res?.styles) ? res.styles : [];
    styles.forEach((s: any) => {
        const selectors = Array.isArray(s?.selectors) ? s.selectors : [];
        const style = s?.style && typeof s.style === "object" ? s.style : {};

        const selectorLabel = selectors.length ? selectors.join(", ") : "(no selectors)";

        changes.push({
            id: uuidv4(),
            type: "style",
            enabled: true,
            label: `Update styles: ${selectorLabel}`,
            selectors,
            style,
        });
    });

    // If nothing usable came back, return a single disabled entry for UI clarity
    if (!changes.length) {
        changes.push({
            id: uuidv4(),
            type: "style",
            enabled: false,
            label: "No changes returned",
            selectors: [],
            style: {},
        });
    }

    return changes;
}

/**
 * Applies all enabled changes to the editor.
 *
 * @param editor - GrapesJS editor instance.
 * @param changes - List of changes (only `enabled === true` will be applied).
 */
export function applyAIChanges(editor: any, changes: AIChange[]): void {
    changes.filter((c) => c.enabled).forEach((c) => applyAIChange(editor, c));
}

/**
 * Handles the apply aichange operation.
 *
 * @param {any} editor - The editor value.
 * @param {any} change: AIChange): void {
    if (!editor) return;

    if (change.type - The change: aichange): void {
    if (!editor) return;

    if (change.type value.
 */
export function applyAIChange(editor: any, change: AIChange): void {
    if (!editor) return;

    if (change.type === "component") {
        const existing = findComponentByAnyId(editor, change.targetId);
        if (!existing) return;

        const parent = existing.parent();
        const index = typeof existing.index === "function" ? existing.index() : null;

        // Remove first to avoid inconsistent replaceWith behavior across GrapesJS versions
        existing.remove();

        const added = parent?.components?.()?.add?.(change.component, {
            at: typeof index === "number" ? index : undefined,
        });

        const addedArr = Array.isArray(added) ? added : (added ? [added] : []);

        // Keep the original root id stable (pin first root node to targetId)
        const newCmp = addedArr[0];
        if (newCmp?.setId) newCmp.setId(change.targetId);

        return;
    }

    if (change.type === "style") {
        (change.selectors || []).forEach((selector) => applyCssRule(editor, selector, change.style || {}));
    }
}
