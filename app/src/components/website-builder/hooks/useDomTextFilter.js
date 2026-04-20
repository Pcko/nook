import {useEffect} from "react";

/**
 *
 * @param q
 */
function normalizeQuery(q) {
    return (q || "").trim().toLowerCase();
}

/**
 *
 * @param itemEl
 * @param itemTextSelector
 */
function getItemText(itemEl, itemTextSelector) {
    if (!itemEl) return "";

    if (itemTextSelector) {
        const nodes = itemEl.querySelectorAll(itemTextSelector);
        if (nodes && nodes.length) {
            return Array.from(nodes)
                .map((n) => (n.textContent || "").trim())
                .filter(Boolean)
                .join(" ");
        }
    }

    return (itemEl.textContent || "").trim();
}

/**
 * Sets visible.
 *
 * @param {any} el - The el value.
 * @param {any} visible - The visible value.
 */
function setVisible(el, visible) {
    if (!el) return;

    // Save previous inline display once
    if (el.dataset.__domFilterPrevDisplay === undefined) {
        el.dataset.__domFilterPrevDisplay = el.style.display || "";
    }

    if (visible) {
        el.style.display = el.dataset.__domFilterPrevDisplay;
    } else {
        el.style.display = "none";
    }
}

/**
 *
 * @param rootEl
 * @param query
 * @param opts
 */
function applyFilter(rootEl, query, opts) {
    const {
        itemSelector,
        itemTextSelector,
        groupSelector,
        groupTitleSelector,
    } = opts;

    if (!rootEl || !itemSelector) return;

    const q = normalizeQuery(query);

    // If empty, show everything (and groups)
    if (!q) {
        rootEl.querySelectorAll(itemSelector).forEach((el) => setVisible(el, true));
        if (groupSelector) {
            rootEl.querySelectorAll(groupSelector).forEach((el) => setVisible(el, true));
        }
        return;
    }

    const allItems = Array.from(rootEl.querySelectorAll(itemSelector));
    const remaining = new Set(allItems);

    // Filter groups (if provided) first, so we can hide empty groups
    if (groupSelector) {
        const groups = Array.from(rootEl.querySelectorAll(groupSelector));

        groups.forEach((groupEl) => {
            const titleEl = groupTitleSelector ? groupEl.querySelector(groupTitleSelector) : null;
            const titleText = normalizeQuery(titleEl?.textContent || "");
            const titleMatch = titleText.includes(q);

            const itemsInGroup = Array.from(groupEl.querySelectorAll(itemSelector));
            itemsInGroup.forEach((itemEl) => {
                remaining.delete(itemEl);
                const text = normalizeQuery(getItemText(itemEl, itemTextSelector));
                const match = titleMatch || text.includes(q);
                setVisible(itemEl, match);
            });

            const anyVisible = itemsInGroup.some((itemEl) => itemEl.style.display !== "none");
            setVisible(groupEl, titleMatch || anyVisible);
        });
    }

    // Items not in any group
    remaining.forEach((itemEl) => {
        const text = normalizeQuery(getItemText(itemEl, itemTextSelector));
        setVisible(itemEl, text.includes(q));
    });
}

/**
 * Provides the use dom text filter hook.
 *
 * @param {Object} props - Component props.
 * @param {any} props.rootSelector - The root selector value.
 * @param {any} props.enabled - The enabled value.
 * @param {any} props.query - The query value.
 * @param {any} props.itemSelector - The item selector value.
 * @param {any} props.itemTextSelector - The item text selector value.
 * @param {any} props.groupSelector - The group selector value.
 * @param {any} props.groupTitleSelector - The group title selector value.
 */
export function useDomTextFilter({
    rootSelector,
    enabled = true,
    query = "",
    itemSelector,
    itemTextSelector,
    groupSelector,
    groupTitleSelector,
}) {
    useEffect(() => {
        const rootEl = rootSelector ? document.querySelector(rootSelector) : null;

        // If disabled or not found, make sure we clean up any prior filtering.
        if (!enabled || !rootEl) {
            if (rootEl) {
                applyFilter(rootEl, "", {
                    itemSelector,
                    itemTextSelector,
                    groupSelector,
                    groupTitleSelector,
                });
            }
            return;
        }

        let raf = 0;
        /**
 * Handles the run operation.
 */
        const run = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                applyFilter(rootEl, query, {
                    itemSelector,
                    itemTextSelector,
                    groupSelector,
                    groupTitleSelector,
                });
            });
        };

        run();

        const obs = new MutationObserver(() => run());
        obs.observe(rootEl, {childList: true, subtree: true});

        return () => {
            if (raf) cancelAnimationFrame(raf);
            obs.disconnect();
        };
    }, [
        rootSelector,
        enabled,
        query,
        itemSelector,
        itemTextSelector,
        groupSelector,
        groupTitleSelector,
    ]);
}
