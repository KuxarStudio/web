const REVEAL_ATTR = '[data-reveal]';
const GROUP_ATTR = '[data-reveal-group]';
const VISIBLE_CLASS = 'is-visible';
/** Added once the entrance transition finishes. Components like .card and
 * .log-row use it to swap back to a fast, undelayed transition so a later
 * hover doesn't inherit the slow reveal duration or the stagger delay. */
const SETTLED_CLASS = 'revealed';
const STAGGER_STEP_MS = 80;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Gives each direct child inside a [data-reveal-group] an incremental
 * --reveal-delay so the group cascades in instead of revealing at once. */
function applyStagger(): void {
  document.querySelectorAll<HTMLElement>(GROUP_ATTR).forEach((group) => {
    let index = 0;
    for (const child of group.children) {
      if (!(child instanceof HTMLElement) || !child.hasAttribute('data-reveal')) continue;
      child.style.setProperty('--reveal-delay', `${index * STAGGER_STEP_MS}ms`);
      index++;
    }
  });
}

function settle(el: HTMLElement): void {
  el.classList.add(SETTLED_CLASS);
  el.style.removeProperty('--reveal-delay');
}

function reveal(el: HTMLElement): void {
  el.classList.add(VISIBLE_CLASS);
  el.addEventListener('transitionend', () => settle(el), { once: true });
}

export function initScrollReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>(REVEAL_ATTR);
  if (targets.length === 0) return;

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add(VISIBLE_CLASS, SETTLED_CLASS));
    return;
  }

  applyStagger();

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target as HTMLElement);
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
