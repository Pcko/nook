// components/layout/ResizablePanelsLayout.jsx
import React, { useRef } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

export default function ResizablePanelsLayout({
  left,
  editor,
  right,
  autoSaveId = "website-builder-layout",
  onLayout,
}) {
  const SZ  = { left: 20, editor: 60, right: 20 };   // defaults
  const MIN = { left: 18, editor: 30, right: 18 };
  const MAX = { left: 25, editor: 70, right: 25 };
  const EPS = { in: 0.5, out: 1.1 };                 // snapping

  const groupRef = useRef(null);
  const dragging = useRef(false);
  const active   = useRef/** @type {'left'|'right'|null} */(null);
  const snapped  = useRef/** @type {'left'|'right'|null} */(null);


  const maybeSnap = ([L0, E0, R0]) => {
    if (!dragging.current || !active.current) return;

    let L = L0, E = E0, R = R0;
    const side   = active.current;
    const curr   = side === "left" ? L : R;
    const target = SZ[side];
    const dist   = Math.abs(curr - target);

    const pin = () => {
      if (side === "left") L = target; else R = target;
      E = 100 - L - R;
      groupRef.current?.setLayout?.([L, E, R]);
    };

    if (snapped.current !== side && dist <= EPS.in) { pin(); snapped.current = side; return; }
    if (snapped.current === side && dist >  EPS.out) { snapped.current = null; return; }
    if (snapped.current === side && Math.abs(curr - target) > 0.001) pin();
  };

  const onDrag = (side) => (isDragging) => {
    dragging.current = isDragging;
    active.current   = isDragging ? side : null;
    if (!isDragging) snapped.current = null;
  };

  return (
    <PanelGroup
      autoSaveId={autoSaveId}
      direction="horizontal"
      onLayout={(sizes) => { onLayout?.(sizes); maybeSnap(sizes); }}
      ref={groupRef}
    >
      <Panel defaultSize={SZ.left}   maxSize={MAX.left}   minSize={MIN.left}>{left}</Panel>
      <PanelResizeHandle className="ResizeHandle" onDragging={onDrag("left")} />

      <Panel defaultSize={SZ.editor} maxSize={MAX.editor} minSize={MIN.editor}>{editor}</Panel>
      <PanelResizeHandle className="ResizeHandle" onDragging={onDrag("right")} />

      <Panel defaultSize={SZ.right}  maxSize={MAX.right}  minSize={MIN.right}>{right}</Panel>
    </PanelGroup>
  );
}