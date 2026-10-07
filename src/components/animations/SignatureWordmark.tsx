"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Native vector lettering: no per-glyph bitmap seams or destructive canvas masks. */
export default function SignatureWordmark() {
  const texts = useRef<(SVGTextElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [boxes, setBoxes] = useState([{x:20,y:35,width:445,height:170},{x:520,y:35,width:510,height:170}]);
  const reduced = useReducedMotion();
  useEffect(() => {
    let alive = true;
    const measure = () => { if (alive) setBoxes(texts.current.map(node => {
      const box = node?.getBBox();
      return box ? {x:box.x,y:box.y,width:box.width,height:box.height} : {x:0,y:0,width:0,height:0};
    })); };
    document.fonts.ready.then(measure);
    return () => {alive=false;};
  }, []);
  const selected = active === null ? null : boxes[active];
  return <svg className="signature-vector" viewBox="0 0 1120 250" role="group" aria-label="Yello Stack interactive wordmark" onPointerLeave={() => setActive(null)}>
    {["Yello", "Stack"].map((word,i) => <motion.g key={word} tabIndex={0} role="img" aria-label={`${word}: highlight word`} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} animate={{y:active===i && !reduced ? -3 : 0}} transition={{duration:.35}}>
      <text ref={element => {texts.current[i]=element;}} x={i===0?20:510} y={200} fontSize={200} fontWeight={600} letterSpacing={-11} fill={active===i?"#ffcf00":"#f4f3e9"}>{word}</text>
    </motion.g>)}
    {selected && <motion.rect key={active} x={selected.x-8} y={selected.y-12} width={selected.width+16} height={selected.height+20} rx={3} fill="none" stroke="#ffcf00" strokeWidth={.7} strokeDasharray="4 5" initial={{opacity:0}} animate={{opacity:.5}} transition={{duration:reduced?0:.25}} pointerEvents="none"/>}
  </svg>;
}
