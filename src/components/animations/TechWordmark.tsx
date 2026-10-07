"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const word = "YelloStack";
type Glyph = { x: number; width: number };

/** Tech lettering rendered as vectors, avoiding bitmap clipping at glyph edges. */
export default function TechWordmark() {
  const svg = useRef<SVGSVGElement>(null);
  const measure = useRef<SVGTextElement>(null);
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const grab = useRef({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({ width: 1080, top: 45, height: 155 });
  const reduced = useReducedMotion();

  useEffect(() => {
    let alive = true;
    const layout = () => {
      const text = measure.current;
      if (!alive || !text) return;
      const box = text.getBBox();
      // Positions come from one shaped word, preserving its natural spacing.
      setGlyphs(Array.from(word, (_, i) => ({ x: text.getStartPositionOfChar(i).x, width: text.getExtentOfChar(i).width })));
      setBounds({ width: Math.max(1, box.width + 56), top: box.y, height: box.height });
    };
    document.fonts.ready.then(layout);
    return () => { alive = false; };
  }, []);

  const point = (clientX: number, clientY: number) => {
    const matrix = svg.current?.getScreenCTM();
    return matrix ? new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse()) : new DOMPoint();
  };
  const release = () => { setDragging(null); setOffset({ x: 0, y: 0 }); };
  const selected = active === null ? null : glyphs[active];
  const shift = active === dragging ? offset : { x: 0, y: 0 };

  return <svg ref={svg} className="tech-wordmark" viewBox={`0 0 ${bounds.width} 260`} role="group" aria-label="YelloStack interactive lettering" onPointerLeave={() => { if (dragging === null) setActive(null); }} onPointerMove={event => {
    if (dragging === null) return;
    const current = point(event.clientX, event.clientY);
    setOffset({ x: Math.max(-45, Math.min(45, current.x - grab.current.x)), y: Math.max(-24, Math.min(24, current.y - grab.current.y)) });
  }} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
    <text ref={measure} x={28} y={205} fontSize={200} fontWeight={600} letterSpacing={-7} fill="#f4f3e9" opacity={glyphs.length ? 0 : 1} aria-hidden="true" pointerEvents="none">{word}</text>
    {glyphs.map((glyph, index) => {
      const highlighted = active === index;
      return <motion.g key={index} tabIndex={0} role="img" aria-label={`Letter ${word[index]}. Hover to outline; drag to move.`} onFocus={() => setActive(index)} onBlur={() => { setActive(null); release(); }} onPointerEnter={() => { if (dragging === null) setActive(index); }} onKeyDown={event => {
        if (event.key === "Escape") { release(); setActive(null); }
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const next = (index + (event.key === "ArrowRight" ? 1 : word.length - 1)) % word.length;
          svg.current?.querySelectorAll<SVGGElement>('g[tabindex="0"]')[next]?.focus();
        }
      }} onPointerDown={event => {
        if (event.pointerType !== "mouse" || event.button !== 0 || reduced) return;
        event.preventDefault();
        const current = point(event.clientX, event.clientY);
        grab.current = { x: current.x, y: current.y };
        setDragging(index); setActive(index);
        event.currentTarget.setPointerCapture(event.pointerId);
      }} animate={{ x: dragging === index ? offset.x : 0, y: dragging === index ? offset.y : 0 }} transition={reduced ? { duration: 0 } : dragging === index ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 22 }}>
        <rect x={glyph.x - 2} y={bounds.top - 8} width={glyph.width + 4} height={bounds.height + 16} fill="transparent" />
        <motion.text x={glyph.x} y={205} fontSize={200} fontWeight={600} animate={{ fill: highlighted ? "#ffcf00" : "#f4f3e9", fillOpacity: highlighted && !reduced ? 0 : 1 }} transition={{ duration: reduced ? 0 : .22 }} pointerEvents="none">{word[index]}</motion.text>
        <motion.text x={glyph.x} y={205} fontSize={200} fontWeight={600} fill="none" stroke="#ffcf00" strokeWidth={1.2} strokeDasharray="4 2" animate={{ opacity: highlighted && !reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : .22 }} pointerEvents="none">{word[index]}</motion.text>
      </motion.g>;
    })}
    {selected && active !== null && !reduced && <motion.g pointerEvents="none" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1, x: shift.x, y: shift.y }} transition={{ duration: dragging === null ? .18 : 0 }}>
      <rect x={selected.x - 6} y={bounds.top - 8} width={selected.width + 12} height={bounds.height + 16} fill="none" stroke="#ffcf00" strokeWidth={.6} opacity={.7} />
      {[0, 1].flatMap(x => [0, 1].map(y => <rect key={`${x}-${y}`} x={selected.x - 8 + x * (selected.width + 12)} y={bounds.top - 10 + y * (bounds.height + 16)} width={4} height={4} fill="#ffcf00" />))}
      <text x={selected.x - 6} y={bounds.top - 17} fontSize={8} fill="#ffcf00" fontFamily="monospace">{word[active]} / {Math.round(selected.width)} × {Math.round(bounds.height)}</text>
    </motion.g>}
  </svg>;
}
