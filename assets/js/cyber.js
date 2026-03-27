/* === CYBERPUNK PORTFOLIO JS === */

// ── Particle Network ──────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const COUNT = 55;
  const LINE_DIST = 140;
  const REPEL_DIST = 180;
  let mouse = { x: -9999, y: -9999 };
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x:  rand(0, canvas.width),
      y:  rand(0, canvas.height),
      vx: rand(-0.4, 0.4),
      vy: rand(-0.4, 0.4),
      r:  rand(1.5, 3),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function update(p) {
    // mouse repulsion
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPEL_DIST && dist > 0) {
      const force = (REPEL_DIST - dist) / REPEL_DIST * 0.015;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    }

    // friction
    p.vx *= 0.995;
    p.vy *= 0.995;

    // clamp speed
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > 1.2) { p.vx = (p.vx / speed) * 1.2; p.vy = (p.vy / speed) * 1.2; }

    p.x += p.vx;
    p.y += p.vy;

    // bounce
    if (p.x < 0) { p.x = 0; p.vx *= -1; }
    if (p.x > canvas.width)  { p.x = canvas.width;  p.vx *= -1; }
    if (p.y < 0) { p.y = 0; p.vy *= -1; }
    if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINE_DIST) {
          const alpha = (1 - d / LINE_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
      ctx.fill();
    });
  }

  function loop() {
    particles.forEach(update);
    draw();
    animId = requestAnimationFrame(loop);
  }

  init();
  loop();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    loop();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();


// ── Cursor Sparks ─────────────────────────────────────────────────────────────
(function initSparks() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lastTime = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastTime < 40) return;  // throttle
    lastTime = now;

    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.left = e.clientX + 'px';
    spark.style.top  = e.clientY + 'px';
    spark.style.setProperty('--tx', (Math.random() * 30 - 15) + 'px');
    spark.style.setProperty('--ty', (Math.random() * 30 - 15) + 'px');
    document.body.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  });
})();


// ── Typewriter Effect ─────────────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.querySelector('[data-typewriter]');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = el.dataset.typewriter; return; }

  const text = el.dataset.typewriter;
  let i = 0;
  el.textContent = '';

  // add caret sibling
  const caret = el.nextElementSibling;

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, Math.random() * 50 + 28);
    }
  }
  setTimeout(type, 600);
})();


// ── Hacker Text Scramble ──────────────────────────────────────────────────────
(function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CHARS = 'アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?';

  document.querySelectorAll('.scramble').forEach(el => {
    const original = el.textContent;
    let frame;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(frame);

      frame = setInterval(() => {
        el.textContent = original
          .split('')
          .map((ch, idx) => {
            if (ch === ' ') return ' ';
            if (idx < iteration) return original[idx];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');

        if (iteration >= original.length) clearInterval(frame);
        iteration += 0.5;
      }, 35);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(frame);
      el.textContent = original;
    });
  });
})();


// ── Scroll Reveal ─────────────────────────────────────────────────────────────
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ── Navigation ────────────────────────────────────────────────────────────────
(function initNav() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  // Active state on scroll
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 100) current = sec.id;
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        // close mobile menu
        document.querySelector('.nav-links').classList.remove('open');
      }
    });
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const linksList = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => linksList.classList.toggle('open'));
  }
})();
