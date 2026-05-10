/* ============================================================
   EKTA SACHAN — PORTFOLIO
   script.js
   ============================================================ */

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

// Hoverable elements — enlarge ring
document.querySelectorAll(
  'a, .work-card, .short-card, .personal-card, .popup-btn, .footer-social-btn, .lightbox-close'
).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── 3D DICE + HERO SEQUENTIAL REVEAL ──────────────────────────
const diceIntroStage = document.getElementById('dice-intro-stage');
const diceWrapper = document.getElementById('dice-wrapper');
const diceCube = document.getElementById('dice-cube');
const diceShadow = document.getElementById('dice-shadow');
const spotlightLeft = document.querySelector('.dice-spotlight-left');
const spotlightRight = document.querySelector('.dice-spotlight-right');
const heroEls = document.querySelectorAll(
  '.hero-eyebrow, .hero-title, .hero-subtitle, .hero-cta, .hero-scroll-hint'
);

let diceTriggered = false;
let diceSettled = false;

const FINAL_DICE_ROTATION = 'rotateX(-26deg) rotateY(38deg) rotateZ(0deg)';

const dicePipPatterns = {
  1: ['p-center'],
  2: ['p-tl', 'p-br'],
  3: ['p-tl', 'p-center', 'p-br'],
  4: ['p-tl', 'p-tr', 'p-bl', 'p-br'],
  5: ['p-tl', 'p-tr', 'p-center', 'p-bl', 'p-br'],
  6: ['p-tl', 'p-tr', 'p-ml', 'p-mr', 'p-bl', 'p-br']
};

function makeDicePip(className) {
  const pip = document.createElement('span');
  pip.className = `dice-pip ${className}`;
  return pip;
}

function fillDiceFace(faceSelector, value) {
  const face = document.querySelector(faceSelector);
  if (!face) return;

  face.innerHTML = '';

  dicePipPatterns[value].forEach((positionClass) => {
    face.appendChild(makeDicePip(positionClass));
  });
}

function setFinalDiceFaces() {
  // This matches the orientation in your screenshot:
  // front = 4, right = 1, top = 2
  fillDiceFace('.dice-front', 4);
  fillDiceFace('.dice-right', 1);
  fillDiceFace('.dice-top', 2);

  // Hidden faces, still keeping the full dice structure complete
  fillDiceFace('.dice-left', 3);
  fillDiceFace('.dice-back', 6);
  fillDiceFace('.dice-bottom', 5);
}

function resetDiceIntro() {
  diceTriggered = false;
  diceSettled = false;
  setFinalDiceFaces();

  diceIntroStage.classList.remove('searching', 'found');
  diceIntroStage.style.opacity = '1';

  diceWrapper.style.transition = 'none';
  diceCube.style.transition = 'none';
  diceShadow.style.transition = 'none';

  diceWrapper.style.top = '-180px';
  diceWrapper.style.opacity = '0';

  diceCube.style.transform = FINAL_DICE_ROTATION;

  diceShadow.style.opacity = '0';
  diceShadow.style.transform = 'translateX(-50%) scale(0.2)';
}

function aimSpotlightAtDice(spotlight) {
  if (!spotlight || !diceWrapper) return;

  const diceRect = diceWrapper.getBoundingClientRect();
  const lightRect = spotlight.getBoundingClientRect();

  // Aim at the center of the dice
  const targetX = diceRect.left + diceRect.width / 2;
  const targetY = diceRect.top + diceRect.height / 2;

  // Beam starts from top-center of spotlight
  const originX = lightRect.left + lightRect.width / 2;
  const originY = lightRect.top;

  const dx = targetX - originX;
  const dy = targetY - originY;

  // Angle from vertical direction
  const angle = Math.atan2(dx, dy) * (180 / Math.PI);

  spotlight.style.transform = `rotate(${angle}deg)`;
}

function focusSpotlightsOnDice() {
  // Remove searching first so animation does not override JS transform
  diceIntroStage.classList.remove('searching');

  aimSpotlightAtDice(spotlightLeft);
  aimSpotlightAtDice(spotlightRight);

  diceIntroStage.classList.add('found');
}

function triggerDice() {
  if (diceTriggered) return;
  diceTriggered = true;

  const finalTop = window.innerHeight - 250;

  // Start searchlights first
  diceIntroStage.classList.add('searching');

  // Show dice
  diceWrapper.style.opacity = '1';

  // 1. Fall
  requestAnimationFrame(() => {
    diceWrapper.style.transition =
      'top 1.05s cubic-bezier(0.22, 1, 0.36, 1)';

    diceCube.style.transition =
      'transform 1.05s cubic-bezier(0.22, 1, 0.36, 1)';

    diceShadow.style.transition =
      'opacity 1.05s ease, transform 1.05s ease';

    diceWrapper.style.top = `${finalTop}px`;
    diceCube.style.transform =
      'rotateX(320deg) rotateY(260deg) rotateZ(100deg)';

    diceShadow.style.opacity = '0.82';
    diceShadow.style.transform = 'translateX(-50%) scale(0.78)';
  });

  // 2. Impact shake
  setTimeout(() => {
    diceWrapper.style.transition = 'top 0.16s ease-out';
    diceCube.style.transition = 'transform 0.16s ease-out';
    diceShadow.style.transition = 'transform 0.16s ease-out, opacity 0.16s ease-out';

    diceWrapper.style.top = `${finalTop + 16}px`;
    diceCube.style.transform =
      'rotateX(14deg) rotateY(200deg) rotateZ(-18deg)';

    diceShadow.style.opacity = '1';
    diceShadow.style.transform = 'translateX(-50%) scale(1.06)';
  }, 1080);

  // 3. Small rebound
  setTimeout(() => {
    diceWrapper.style.transition = 'top 0.15s ease-out';
    diceCube.style.transition = 'transform 0.15s ease-out';
    diceShadow.style.transition = 'transform 0.15s ease-out';

    diceWrapper.style.top = `${finalTop + 7}px`;
    diceCube.style.transform =
      'rotateX(-10deg) rotateY(72deg) rotateZ(-12deg)';

    diceShadow.style.transform = 'translateX(-50%) scale(0.92)';
  }, 1270);

  // 4. Final settle exactly like your screenshot
  setTimeout(() => {
    diceWrapper.style.transition = 'top 0.42s ease-out';
    diceCube.style.transition = 'transform 0.42s ease-out';
    diceShadow.style.transition = 'transform 0.42s ease-out, opacity 0.42s ease-out';

    diceWrapper.style.top = `${finalTop + 10}px`;
    diceCube.style.transform = FINAL_DICE_ROTATION;

    diceShadow.style.opacity = '0.95';
    diceShadow.style.transform = 'translateX(-50%) scale(0.9)';

    diceSettled = true;
  }, 1450);

  // 5. Spotlights lock onto dice after it settles
  setTimeout(() => {
    focusSpotlightsOnDice();
  }, 1850);

  // 6. Reveal hero elements after dice settles
  setTimeout(() => {
    heroEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 160);
    });
  }, 2200);
}

resetDiceIntro();

// Play dice once when page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    triggerDice();
  }, 350);
});

// Fade dice away when user scrolls after it settles
window.addEventListener('scroll', handleDiceFadeOnScroll, { passive: true });


function handleDiceFadeOnScroll() {
  if (!diceSettled) return;

  const fadeStart = window.innerHeight * 0.08; // start fading a little after scroll starts
  const fadeEnd = window.innerHeight * 0.38;   // fully gone by this point
  const currentScroll = window.scrollY;

  if (currentScroll <= fadeStart) {
    diceIntroStage.style.opacity = '1';
    return;
  }

  if (currentScroll >= fadeEnd) {
    diceIntroStage.style.opacity = '0';
    return;
  }

  const progress = (currentScroll - fadeStart) / (fadeEnd - fadeStart);
  const opacity = 1 - progress;

  diceIntroStage.style.opacity = opacity.toString();
}




// ── SCROLL REVEAL (sections) ───────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── VIDEO LIGHTBOX ─────────────────────────────────────────
function openLightbox(url, label) {
  document.getElementById('lightbox-iframe').src = url;
  document.getElementById('lightbox-label').textContent = label || '';
  document.getElementById('video-lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  // Clear src to stop video playback immediately
  document.getElementById('lightbox-iframe').src = '';
  document.getElementById('video-lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// Click backdrop to close
document.getElementById('video-lightbox').addEventListener('click', function (e) {
  if (e.target === this) closeLightbox();
});

// Escape key to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});


// ── HERO PARALLAX ──────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    heroBg.style.transform = `translate(${x}px, ${y}px)`;
  }
});
window.addEventListener('resize', () => {
  if (diceSettled) {
    focusSpotlightsOnDice();
  }
});