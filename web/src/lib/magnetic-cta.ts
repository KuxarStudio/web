const SELECTOR = '[data-magnetic]';
/** Max pull toward the cursor, in px. Kept small so the effect reads as a
 * subtle magnetic hint rather than the button chasing the cursor. */
const MAX_OFFSET = 5;
/** Strong ease-out for the return-to-rest animation — no overshoot/bounce,
 * since this fires on every hover and should feel calm, not springy. */
const RETURN_TRANSITION = 'transform .3s cubic-bezier(0.23, 1, 0.32, 1)';

function canHover(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function attachMagnetic(el: HTMLElement): void {
  let rect: DOMRect;

  function onEnter(): void {
    rect = el.getBoundingClientRect();
    // No transition while tracking the cursor — it should follow instantly.
    el.style.transition = 'none';
  }

  function onMove(e: MouseEvent): void {
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const x = Math.max(-1, Math.min(1, relX)) * MAX_OFFSET;
    const y = Math.max(-1, Math.min(1, relY)) * MAX_OFFSET;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function onLeave(): void {
    el.style.transition = RETURN_TRANSITION;
    el.style.transform = 'translate(0, 0)';
  }

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
}

export function initMagneticCta(): void {
  if (!canHover() || prefersReducedMotion()) return;
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach(attachMagnetic);
}
