// Adds a slightly stronger shadow/border once the user scrolls past the hero,
// only relevant on the homepage where the header is sticky.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  if (!header || !header.classList.contains('sticky')) return;

  const onScroll = () => {
    if (window.scrollY > 12) {
      header.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
    } else {
      header.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

// Featured Projects carousel — shows a responsive number of cards at a time,
// moves via arrows (no infinite looping — it stops at the first/last card),
// and reveals the left/right arrow based on which half of the carousel the
// cursor is hovering over.
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('projectCarousel');
  if (!wrap) return;

  const viewport = wrap.querySelector('.carousel-viewport');
  const track = wrap.querySelector('.carousel-track');
  const leftArrow = wrap.querySelector('.carousel-arrow.left');
  const rightArrow = wrap.querySelector('.carousel-arrow.right');
  const slots = Array.from(track.children); // the 6 real project cards
  const total = slots.length;
  const gap = 24; // must match gap used in .carousel-track CSS

  let visible = getVisibleCount();
  let index = 0; // index of the leftmost visible card, 0..(total-visible)

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 980) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, total - visible);
  }

  function cardWidth() {
    const vw = viewport.clientWidth;
    return (vw - gap * (visible - 1)) / visible;
  }

  function layout(animate) {
    const cw = cardWidth();
    slots.forEach(el => { el.style.width = cw + 'px'; });
    const offset = index * (cw + gap);
    track.style.transition = animate ? 'transform 0.45s cubic-bezier(.4,0,.2,1)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
    updateArrowStates();
  }

  function updateArrowStates() {
    leftArrow.classList.toggle('disabled', index <= 0);
    rightArrow.classList.toggle('disabled', index >= maxIndex());
  }

  function build() {
    visible = getVisibleCount();
    index = Math.min(index, maxIndex());
    layout(false);
  }

  function go(direction) {
    index = Math.min(maxIndex(), Math.max(0, index + direction));
    layout(true);
  }

  rightArrow.addEventListener('click', () => go(1));
  leftArrow.addEventListener('click', () => go(-1));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 120);
  });

  // Show the left arrow when hovering the left half, right arrow on the right half
  // (an arrow stays hidden if it's disabled, e.g. at the very start or end).
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (pct < 0.5) {
      if (!leftArrow.classList.contains('disabled')) leftArrow.classList.add('visible');
      rightArrow.classList.remove('visible');
    } else {
      if (!rightArrow.classList.contains('disabled')) rightArrow.classList.add('visible');
      leftArrow.classList.remove('visible');
    }
  });
  wrap.addEventListener('mouseleave', () => {
    leftArrow.classList.remove('visible');
    rightArrow.classList.remove('visible');
  });

  build();
});
