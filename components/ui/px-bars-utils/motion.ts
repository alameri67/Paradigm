/** Motion helpers for PxBars. Written for this project: the supplied component imports them. */

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

/**
 * One step of a damped spring towards `target`, in place (semi-implicit Euler).
 * `stiffness` is in 1/s²; `damping` is the damping ratio (1 = no overshoot, lower = bouncier).
 * Long frames are split into small steps so the spring stays stable.
 */
export function springEuler(state: { position: number; velocity: number }, target: number, delta: number, stiffness: number, damping: number) {
  const c = 2 * damping * Math.sqrt(stiffness);
  let left = Math.min(Math.max(delta, 0), 0.1);
  while (left > 0) {
    const dt = Math.min(left, 1 / 120);
    state.velocity += (stiffness * (target - state.position) - c * state.velocity) * dt;
    state.position += state.velocity * dt;
    left -= dt;
  }
}
