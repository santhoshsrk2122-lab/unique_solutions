/* Unique Solutions — mobile nav, hero slider, contact form validation. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------ mobile nav */
  var toggle = document.querySelector('.nav__toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* --------------------------------------------------------------- slider */
  var hero = document.querySelector('[data-slider]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero__dot'));
    var prev = hero.querySelector('[data-slider-prev]');
    var next = hero.querySelector('[data-slider-next]');
    var playBtn = hero.querySelector('[data-slider-play]');
    var counter = hero.querySelector('[data-slider-count]');
    var index = 0;
    var timer = null;
    var playing = !reduceMotion.matches;
    var DELAY = 6500;

    function show(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var live = i === index;
        slide.classList.toggle('is-live', live);
        slide.setAttribute('aria-hidden', String(!live));
        // keep off-screen slides out of the tab order
        slide.querySelectorAll('a, button').forEach(function (el) {
          if (live) { el.removeAttribute('tabindex'); }
          else { el.setAttribute('tabindex', '-1'); }
        });
      });
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', String(i === index));
      });
      if (counter) {
        counter.textContent = (index + 1) + ' / ' + slides.length;
      }
    }

    function start() {
      stop();
      if (!playing) return;
      timer = window.setInterval(function () { show(index + 1); }, DELAY);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function setPlaying(on) {
      playing = on;
      if (playBtn) {
        playBtn.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow');
        playBtn.textContent = on ? '❚❚' : '▶';
      }
      if (on) { start(); } else { stop(); }
    }

    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); start(); });
    });
    if (playBtn) playBtn.addEventListener('click', function () { setPlaying(!playing); });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', function () { if (playing) start(); });
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', function (e) {
      if (!hero.contains(e.relatedTarget) && playing) start();
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else if (playing) { start(); }
    });
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(index - 1); start(); }
      if (e.key === 'ArrowRight') { show(index + 1); start(); }
    });

    // swipe on touch devices
    var startX = null;
    hero.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) { show(index + (dx < 0 ? 1 : -1)); start(); }
      startX = null;
    });

    show(0);
    setPlaying(playing);
    reduceMotion.addEventListener('change', function (e) { setPlaying(!e.matches); });
  }

  /* ---------------------------------------------------------- enquiry form */
  var form = document.querySelector('[data-enquiry]');
  if (form) {
    var note = form.querySelector('[data-enquiry-note]');

    function fieldOf(input) { return input.closest('.field'); }

    function check(input) {
      var wrap = fieldOf(input);
      if (!wrap) return true;
      var msg = '';
      var value = input.value.trim();

      if (input.required && !value) {
        msg = input.dataset.empty || 'Fill this in before sending.';
      } else if (value && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        msg = 'Use the form name@company.com so we can reply.';
      } else if (value && input.type === 'tel' && value.replace(/\D/g, '').length < 10) {
        msg = 'Enter a 10-digit mobile number we can call back on.';
      }

      wrap.classList.toggle('is-bad', Boolean(msg));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var err = wrap.querySelector('.err');
      if (err) err.textContent = msg;
      return !msg;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { check(input); });
      input.addEventListener('input', function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.classList.contains('is-bad')) check(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      var bad = inputs.filter(function (i) { return !check(i); });

      if (bad.length) {
        if (note) {
          note.hidden = false;
          note.textContent = bad.length === 1
            ? 'One field still needs attention — it is marked below.'
            : bad.length + ' fields still need attention — they are marked below.';
        }
        bad[0].focus();
        return;
      }

      // No backend on a static site: hand the enquiry to the mail client.
      var get = function (n) {
        var el = form.elements[n];
        return el ? el.value.trim() : '';
      };
      var body = [
        'Name: ' + get('name'),
        'Organisation: ' + (get('org') || '—'),
        'Phone: ' + get('phone'),
        'Email: ' + get('email'),
        'Site location: ' + (get('location') || '—'),
        'System needed: ' + get('system'),
        '',
        get('message')
      ].join('\n');

      window.location.href = 'mailto:sales@uniquesolutionstech.in'
        + '?subject=' + encodeURIComponent('Site survey request — ' + get('system'))
        + '&body=' + encodeURIComponent(body);

      if (note) {
        note.hidden = false;
        note.textContent = 'Your mail app is opening with the enquiry filled in. Send it and we will call you back within one working day. Prefer to talk now? Call +91 97862 19202.';
      }
    });
  }

  /* ------------------------------------------------------------ year stamp */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
