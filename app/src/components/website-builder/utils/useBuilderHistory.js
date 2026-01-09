import {useCallback, useEffect, useRef, useState} from "react";

/**
 * useBuilderHistory
 *
 * Adds lightweight snapshot history (view + restore) on top of GrapesJS editor state.
 * Designed to be "plugged into" BuilderProvider with minimal changes.
 *
 * @param {Object} params
 * @param {import("react").MutableRefObject<any>} params.editorRef
 * @param {boolean} params.editorReady
 * @param {(data: any) => void} params.setPage
 * @returns {{
 *   history: Array<{id: string, ts: number, reason: string, data: any}>,
 *   historyIndex: number,
 *   goToHistory: (index: number) => void,
 *   captureHistory: (reason?: string) => void,
 * }}
 */
export function useBuilderHistory({editorRef, editorReady, setPage}) {
    // --- lightweight snapshot history (view + restore) ---
    const MAX_HISTORY = 50;
    const [historyState, setHistoryState] = useState({items: [], index: -1});
    const historyStateRef = useRef(historyState);
    const restoringRef = useRef(false);
    const lastSnapshotHashRef = useRef(null);
    const snapshotTimerRef = useRef(null);
    const pendingReasonRef = useRef({reason: null, prio: 0});
    const isBlockDraggingRef = useRef(false);
    const componentDragRef = useRef({active: false, startParent: null, startIndex: null, target: null});
    const lastBlockDropRef = useRef(0);

    useEffect(() => {
        historyStateRef.current = historyState;
    }, [historyState]);

    const captureHistory = useCallback(
            (reason = "Edit") => {
                const editor = editorRef.current;
                if (!editor) return;

                const data = editor.getProjectData();
                let hash = null;
                let snapshotData = data;
                try {
                    hash = JSON.stringify(data);
                    // Store a deep copy so older snapshots don't get mutated by later editor changes.
                    snapshotData = JSON.parse(hash);
                } catch (e) {
                    // If serialization fails for any reason, still store a snapshot.
                    hash = String(Date.now());
                    snapshotData = data;
                }

                if (hash && hash === lastSnapshotHashRef.current) return;
                lastSnapshotHashRef.current = hash;

                setHistoryState((prev) => {
                    const base = prev.items.slice(0, prev.index + 1);
                    const entry = {
                        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                        ts: Date.now(),
                        reason,
                        data: snapshotData,
                    };

                    let nextItems = [...base, entry];
                    let nextIndex = nextItems.length - 1;

                    if (nextItems.length > MAX_HISTORY) {
                        const overflow = nextItems.length - MAX_HISTORY;
                        nextItems = nextItems.slice(overflow);
                        nextIndex = Math.max(0, nextIndex - overflow);
                    }

                    return {items: nextItems, index: nextIndex};
                });
            },
            [editorRef]
    );

    const goToHistory = useCallback(
            (index) => {
                const editor = editorRef.current;
                const hs = historyStateRef.current;
                if (!editor) return;
                if (!hs?.items?.length) return;
                if (index < 0 || index >= hs.items.length) return;

                const snap = hs.items[index];
                restoringRef.current = true;

                try {
                    if (typeof editor.loadProjectData === "function") {
                        editor.loadProjectData(snap.data);
                    } else {
                        // Fallback: keep UI selection consistent at least
                        editor.select(null);
                    }
                } finally {
                    // prevent immediate re-snapshot from restore-triggered updates
                    setTimeout(() => {
                        restoringRef.current = false;
                    }, 300);
                }

                // keep local page data aligned with the restored state
                setPage(snap.data);

                // keep the duplicate filter aligned with the restored snapshot
                try {
                    lastSnapshotHashRef.current = JSON.stringify(snap.data);
                } catch (e) {
                    lastSnapshotHashRef.current = String(Date.now());
                }

                setHistoryState((prev) => ({...prev, index}));
            },
            [editorRef, setPage]
    );

    useEffect(() => {
        if (!editorReady) return;
        const editor = editorRef.current;
        if (!editor) return;

        const toPlainText = (val) => {
            if (val == null) return "";
            let s = "";
            if (typeof val === "string") s = val;
            else if (typeof val === "number" || typeof val === "boolean") s = String(val);
            else if (val?.outerHTML) s = val.outerHTML;
            else if (val?.innerHTML) s = val.innerHTML;
            else s = String(val);

            // Normal text
            if (!s.includes("<")) return s.replace(/\s+/g, " ").trim();

            // Browser path (best results)
            if (typeof document !== "undefined") {
                const el = document.createElement("div");
                el.innerHTML = s;
                const txt = el.textContent || el.innerText || "";
                return txt.replace(/\s+/g, " ").trim();
            }

            // Fallback (shouldn't happen in the browser)
            return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        };

        const getCmpLabel = (cmp) => {
            if (!cmp) return "component";
            const name = cmp.get?.("name") || cmp.getName?.();
            const type = cmp.get?.("type");
            // Prefer human-facing name, then type (never raw HTML).
            return toPlainText(name || type || "component") || "component";
        };

        const setPendingReason = (reason, prio) => {
            if (!reason) return;
            const cur = pendingReasonRef.current;
            if (!cur.reason || prio >= cur.prio) {
                pendingReasonRef.current = {reason, prio};
            }
        };

        // Capture snapshots on edits (throttled).
        // We keep the "most specific" reason observed during the throttle window.
        const scheduleSnapshot = (reason, prio = 10) => {
            if (restoringRef.current) return;
            setPendingReason(reason, prio);
            if (snapshotTimerRef.current) return;

            snapshotTimerRef.current = setTimeout(() => {
                snapshotTimerRef.current = null;
                const picked = pendingReasonRef.current?.reason || "Edit";
                pendingReasonRef.current = {reason: null, prio: 0};
                captureHistory(picked);
            }, 450);
        };

        const getBlockLabel = (block) => {
            if (!block) return "";
            const attrs = block.get?.("attributes");
            const title = attrs?.title || attrs?.name || attrs?.["data-name"];
            const rawLabel = block.get?.("label") || block.getLabel?.() || block?.id;
            const cleaned = toPlainText(title || rawLabel || "");
            // If label is empty/garbage, fall back to block id.
            if (!cleaned || cleaned === "[object Object]") return toPlainText(block?.id || "");
            return cleaned;
        };

        // Track block dragging to avoid misclassifying add/move.
        const onBlockDragStart = () => {
            isBlockDraggingRef.current = true;
        };

        const onBlockDragStop = (component, block) => {
            isBlockDraggingRef.current = false;
            if (!component) return;

            lastBlockDropRef.current = Date.now();

            // Prefer block label (more user-friendly) and fallback to component label.
            const label = getBlockLabel(block) || getCmpLabel(component);
            scheduleSnapshot(`Added ${label}`, 95);
        };

        const onAdd = (cmp) => {
            // GrapesJS might trigger component:add also when moving components (known issue),
            // therefore we only treat it as a creation when no drag is in progress.
            const now = Date.now();
            const dragBlock = editor.BlockManager?.getDragBlock?.();

            if (isBlockDraggingRef.current || dragBlock) return;
            if (componentDragRef.current?.active) return;
            if (now - (lastBlockDropRef.current || 0) < 800) return;

            scheduleSnapshot(`Added ${getCmpLabel(cmp)}`, 40);
        };

        const onClone = (cmp) => {
            scheduleSnapshot(`Duplicated ${getCmpLabel(cmp)}`, 85);
        };

        const onRemove = (cmp) => scheduleSnapshot(`Removed ${getCmpLabel(cmp)}`, 90);

        const onDragStart = (data) => {
            if (isBlockDraggingRef.current) return;

            const target = data?.target;
            const parent = data?.parent;

            componentDragRef.current = {
                active: true,
                target: target || null,
                startParent: parent?.getId?.() || parent?.cid || null,
                startIndex: typeof data?.index === "number" ? data.index : null,
            };
        };

        const onDragEnd = (data) => {
            if (isBlockDraggingRef.current) return;

            const target = data?.target || componentDragRef.current?.target;
            const parent = data?.parent;

            const endParent = parent?.getId?.() || parent?.cid || null;
            const endIndex = typeof data?.index === "number" ? data.index : null;

            const start = componentDragRef.current || {};
            componentDragRef.current = {active: false, startParent: null, startIndex: null, target: null};

            // Don't create noise if nothing actually changed.
            const moved =
                    start.active &&
                    (start.startParent !== endParent ||
                            (start.startIndex != null && endIndex != null && start.startIndex !== endIndex));

            if (moved) {
                scheduleSnapshot(`Moved ${getCmpLabel(target)}`, 100);
            }
        };

        const onStyleUpdate = () => {
            // GrapesJS doesn't expose which exact property changed here by default.
            scheduleSnapshot("Style changed", 70);
        };

        const onTraitValue = (payload) => {
            const trait = payload?.trait;
            const component = payload?.component;
            const name = trait?.get?.("name") || trait?.get?.("label") || trait?.attributes?.name;
            scheduleSnapshot(`Trait changed: ${name || getCmpLabel(component)}`, 60);
        };

        const onUpdate = () => scheduleSnapshot("Edited", 10);

        // Block-drag is the most reliable way to detect "Added" from the block manager.
        editor.on("block:drag:start", onBlockDragStart);
        editor.on("block:drag:stop", onBlockDragStop);

        editor.on("component:add", onAdd);
        editor.on("component:clone", onClone);
        editor.on("component:remove", onRemove);

        // For moves use component drag events (args are objects with target/parent/index).
        editor.on("component:drag:start", onDragStart);
        editor.on("component:drag:end", onDragEnd);

        editor.on("component:styleUpdate", onStyleUpdate);
        editor.on("trait:value", onTraitValue);
        editor.on("update", onUpdate);

        // Add one initial snapshot (best-effort) once editor is ready.
        // If the page state loads slightly later, the next update will snapshot it.
        scheduleSnapshot("Initial", 1);

        return () => {
            editor.off("block:drag:start", onBlockDragStart);
            editor.off("block:drag:stop", onBlockDragStop);

            editor.off("component:add", onAdd);
            editor.off("component:clone", onClone);
            editor.off("component:remove", onRemove);

            editor.off("component:drag:start", onDragStart);
            editor.off("component:drag:end", onDragEnd);

            editor.off("component:styleUpdate", onStyleUpdate);
            editor.off("trait:value", onTraitValue);
            editor.off("update", onUpdate);

            if (snapshotTimerRef.current) {
                clearTimeout(snapshotTimerRef.current);
                snapshotTimerRef.current = null;
            }
        };
    }, [editorReady, editorRef, captureHistory]);

    return {
        history: historyState.items,
        historyIndex: historyState.index,
        goToHistory,
        captureHistory,
    };
}
