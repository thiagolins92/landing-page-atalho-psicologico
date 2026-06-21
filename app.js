/* ===========================================================================
   Atalho Psicológico — interactive behavior
   Ported from the Claude Design prototype's DCLogic component
   (Atalho Psicologico.dc.html + Countdown.dc.html).

   Config defaults match the prototype's data-props:
     countdownMinutes = 15, spotsLeft = 37, showScarcity = true
   =========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    countdownMinutes: 15,
    spotsLeft: 37,
    showScarcity: true
  };

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Countdown ---------------------------------------------------------
     Loops mm:ss from `countdownMinutes` down to 00:00, then restarts.       */
  function initCountdown() {
    var mmEl = document.getElementById('countdown-mm');
    var ssEl = document.getElementById('countdown-ss');
    if (!mmEl || !ssEl) return;

    var total = Math.max(1, CONFIG.countdownMinutes) * 60;
    var remaining = total;
    var pad = function (n) { return String(n).padStart(2, '0'); };

    function render() {
      mmEl.textContent = pad(Math.floor(remaining / 60));
      ssEl.textContent = pad(remaining % 60);
    }
    render();
    setInterval(function () {
      remaining = remaining > 0 ? remaining - 1 : total;
      render();
    }, 1000);
  }

  /* ---- Scarcity bar ------------------------------------------------------
     Bar fills as spots drop (width = 100 - spots). Starts when the bar
     scrolls into view; decrements with growing gaps down to a floor of 10. */
  function initScarcity() {
    var bar = document.getElementById('scarcity-bar');
    var spotsEl = document.getElementById('scarcity-spots');
    if (!bar || !spotsEl || !CONFIG.showScarcity) return;

    var spots = CONFIG.spotsLeft;
    var MIN = 10;

    function renderBar() {
      bar.style.width = (100 - spots) + '%';
      spotsEl.textContent = spots + ' restantes';
    }

    var baseDelays = [5000, 6000, 10000];
    function gapFor(i) {
      return i < baseDelays.length
        ? baseDelays[i]
        : baseDelays[baseDelays.length - 1] + (i - baseDelays.length + 1) * 4000;
    }

    function startScarcity() {
      renderBar(); // initial fill-in when the section comes into view
      if (prefersReduced) return; // hold steady; no live ticking
      var i = 0;
      function tick() {
        if (spots <= MIN) return;
        spots -= 1;
        renderBar();
        if (spots <= MIN) return;
        i += 1;
        setTimeout(tick, gapFor(i));
      }
      setTimeout(tick, gapFor(0));
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            setTimeout(startScarcity, 500);
            obs.disconnect();
          }
        });
      }, { threshold: 0.4 });
      obs.observe(bar);
    } else {
      startScarcity();
    }
  }

  /* ---- Scroll reveal -----------------------------------------------------
     Staggers the direct children of [data-reveal] sections into view.
     If a section is mostly one grid of cards, the cards are staggered.      */
  function initReveal() {
    var sections = document.querySelectorAll('[data-reveal]');
    if (!sections.length) return;

    if (!('IntersectionObserver' in window) || prefersReduced) return; // content already visible

    sections.forEach(function (el) {
      var kids = Array.prototype.slice.call(el.children);
      if (kids.length === 2 && kids[1].children.length >= 3) {
        kids = [kids[0]].concat(Array.prototype.slice.call(kids[1].children));
      }
      kids.forEach(function (k, i) {
        k.style.opacity = '0';
        k.style.transform = 'translateY(32px)';
        k.style.transition = 'opacity .7s ease, transform .75s cubic-bezier(.2,.7,.3,1)';
        k.style.transitionDelay = (i * 0.11) + 's';
      });
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            kids.forEach(function (k) {
              k.style.opacity = '1';
              k.style.transform = 'translateY(0)';
            });
            obs.disconnect();
          }
        });
      }, { threshold: 0.15 });
      obs.observe(el);
    });
  }

  /* ---- Grid overlay toggle (press G) ------------------------------------ */
  function initGridToggle() {
    var overlay = document.getElementById('grid-overlay');
    if (!overlay) return;
    window.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA/.test(tag) || (e.target && e.target.isContentEditable)) return;
      if (e.key === 'g' || e.key === 'G') {
        overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
      }
    });
  }

  function init() {
    initCountdown();
    initScarcity();
    initReveal();
    initGridToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
