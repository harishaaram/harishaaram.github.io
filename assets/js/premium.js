/* Premium portfolio interactions */
(function () {
  "use strict";

  /* Nav scroll state */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* Scroll reveal */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealed = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealed.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealed.forEach(function (el) { io.observe(el); });
  }

  /* Typewriter roles */
  var roleEl = document.querySelector("[data-roles]");
  if (roleEl && !reduced) {
    var roles = JSON.parse(roleEl.getAttribute("data-roles"));
    var ri = 0, ci = 0, deleting = false;
    (function tick() {
      var word = roles[ri];
      ci += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, ci);
      var delay = deleting ? 34 : 62;
      if (!deleting && ci === word.length) { delay = 2100; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 420; }
      setTimeout(tick, delay);
    })();
  } else if (roleEl) {
    roleEl.textContent = JSON.parse(roleEl.getAttribute("data-roles"))[0];
  }

  /* Count-up stats */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var stats = document.querySelectorAll("[data-count]");
  if (reduced || !("IntersectionObserver" in window)) {
    stats.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  } else {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          sio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(function (el) { sio.observe(el); });
  }

  /* Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
