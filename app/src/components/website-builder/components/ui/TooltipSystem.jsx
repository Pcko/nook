import React, { useEffect, useRef } from "react";

/**
 * TooltipSystem
 *
 * - One tooltip "host" for the whole app (mount once).
 * - Works via event delegation for ANY element that has `data-wb-tooltip="..."`.
 * - Supports optional:
 *    - data-wb-tooltip-delay="600" (ms)
 *    - data-wb-tooltip-placement="bottom" | "top"
 *
 * Also exports:
 *  - InfoTip: small "i" icon that shows a tooltip.
 */

const STYLE_ID = "wb-tooltip-styles";

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .wb-tooltip-bubble {
      position: fixed;
      z-index: 9999;
      max-width: min(420px, calc(100vw - 24px));
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,0.12);
      background: rgba(20,20,22,0.96);
      color: #fff;
      box-shadow: 0 12px 28px rgba(0,0,0,0.22);
      font-size: 12px;
      line-height: 1.25;
      white-space: pre-line;
      pointer-events: none;
      opacity: 0;
      transform: translateY(6px) scale(0.98);
      transition: opacity 120ms ease, transform 120ms ease;
    }
    .wb-tooltip-bubble[data-open="true"] {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .wb-infotip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 9999px;
      border: 1px solid rgba(0,0,0,0.25);
      background: rgba(255,255,255,0.85);
      color: rgba(0,0,0,0.75);
      font-size: 11px;
      line-height: 1;
      cursor: help;
      user-select: none;
    }
    .wb-infotip:hover { background: rgba(255,255,255,0.95); }
  `;
  document.head.appendChild(style);
}

function closestTooltipTarget(startEl) {
  if (!startEl || !(startEl instanceof Element)) return null;
  return startEl.closest?.("[data-wb-tooltip]") || null;
}

function getDelayMs(el) {
  const raw = el?.getAttribute?.("data-wb-tooltip-delay");
  const ms = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(ms) ? ms : 650;
}

function getPlacement(el) {
  const p = (el?.getAttribute?.("data-wb-tooltip-placement") || "bottom").toLowerCase();
  return p === "top" ? "top" : "bottom";
}

function positionTooltip(bubbleEl, anchorEl) {
  if (!bubbleEl || !anchorEl) return;

  const rect = anchorEl.getBoundingClientRect();

  // Temporarily show to measure.
  bubbleEl.style.left = "0px";
  bubbleEl.style.top = "0px";
  bubbleEl.style.maxWidth = "min(420px, calc(100vw - 24px))";

  const bw = bubbleEl.offsetWidth;
  const bh = bubbleEl.offsetHeight;
  const pad = 10;
  const gap = 8;
  const placement = getPlacement(anchorEl);

  let left = rect.left + rect.width / 2 - bw / 2;
  left = Math.max(pad, Math.min(left, window.innerWidth - bw - pad));

  let top;
  if (placement === "top") {
    top = rect.top - bh - gap;
    if (top < pad) top = rect.bottom + gap; // fallback
  } else {
    top = rect.bottom + gap;
    if (top + bh > window.innerHeight - pad) top = rect.top - bh - gap; // fallback
  }
  top = Math.max(pad, Math.min(top, window.innerHeight - bh - pad));

  bubbleEl.style.left = `${Math.round(left)}px`;
  bubbleEl.style.top = `${Math.round(top)}px`;
}

export function TooltipHost() {
  const bubbleRef = useRef(null);
  const activeElRef = useRef(null);
  const timerRef = useRef(null);
  const openRef = useRef(false);

  useEffect(() => {
    ensureStyles();

    // create bubble once
    const bubble = document.createElement("div");
    bubble.className = "wb-tooltip-bubble";
    bubble.setAttribute("role", "tooltip");
    bubble.setAttribute("aria-hidden", "true");
    bubble.setAttribute("data-open", "false");
    document.body.appendChild(bubble);
    bubbleRef.current = bubble;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const hide = () => {
      clearTimer();
      openRef.current = false;
      activeElRef.current = null;
      if (!bubbleRef.current) return;
      bubbleRef.current.setAttribute("data-open", "false");
      bubbleRef.current.setAttribute("aria-hidden", "true");
      bubbleRef.current.textContent = "";
    };

    const showFor = (el) => {
      if (!el || !bubbleRef.current) return;
      const text = el.getAttribute("data-wb-tooltip");
      if (!text) return;

      bubbleRef.current.textContent = text;
      bubbleRef.current.setAttribute("aria-hidden", "false");
      bubbleRef.current.setAttribute("data-open", "true");
      positionTooltip(bubbleRef.current, el);
      openRef.current = true;
    };

    const scheduleShow = (el) => {
      clearTimer();
      const delay = getDelayMs(el);
      timerRef.current = setTimeout(() => {
        // still the active element?
        if (activeElRef.current === el) showFor(el);
      }, delay);
    };

    const onPointerOver = (e) => {
      const target = closestTooltipTarget(e.target);
      if (!target) return;
      if (activeElRef.current === target) return;

      activeElRef.current = target;
      scheduleShow(target);
    };

    const onPointerOut = (e) => {
      const currentTarget = activeElRef.current;
      if (!currentTarget) return;

      // If moving within the same tooltip target, don't hide.
      const related = e.relatedTarget;
      if (related && currentTarget.contains(related)) return;
      hide();
    };

    const onFocusIn = (e) => {
      const target = closestTooltipTarget(e.target);
      if (!target) return;
      activeElRef.current = target;
      scheduleShow(target);
    };

    const onFocusOut = () => hide();

    const onScrollOrResize = () => {
      if (!openRef.current) return;
      if (!bubbleRef.current || !activeElRef.current) return;
      positionTooltip(bubbleRef.current, activeElRef.current);
    };

    document.addEventListener("mouseover", onPointerOver, true);
    document.addEventListener("mouseout", onPointerOut, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      clearTimer();
      document.removeEventListener("mouseover", onPointerOver, true);
      document.removeEventListener("mouseout", onPointerOut, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);

      if (bubbleRef.current) {
        bubbleRef.current.remove();
        bubbleRef.current = null;
      }
    };
  }, []);

  return null;
}

export function InfoTip({ text, delay = 650, placement = "top", className = "" }) {
  return (
    <span
      className={`wb-infotip ${className}`}
      role="img"
      aria-label="Info"
      data-wb-tooltip={text}
      data-wb-tooltip-delay={String(delay)}
      data-wb-tooltip-placement={placement}
      tabIndex={0}
    >
      i
    </span>
  );
}
