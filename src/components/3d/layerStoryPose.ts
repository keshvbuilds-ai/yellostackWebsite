/** Deterministic scroll poses: reversible, with no accumulated animation state. */
export function layerStoryPose(progress: number, index: number) {
  const p = Math.max(0, Math.min(1, progress));
  const smooth = (a: number, b: number, value: number) => {
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const opened = smooth(0, .065, p) * (1 - smooth(.78, .98, p));
  const start = index * .25;
  const focus = smooth(start, start + .055, p) * (1 - smooth(start + .205, start + .255, p));
  return {
    x: opened * (-1.25 + focus * 3.1 + (index - 1) * .25),
    y: (1 - index) * (1.02 + opened * 1.1) - (1 - index) * focus * opened * 1.25,
    z: opened * (-1.2 + focus * 3.9),
    rotationY: opened * ((index - 1) * .22 + focus * .32),
    rotationZ: opened * (index - 1) * .06,
    scale: 1 - opened * .12 + focus * opened * .16,
    emphasis: focus,
    opened,
  };
}
