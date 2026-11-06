/* Lif landing page: menu, sticky download bar, click tracking. No dependencies. */
(function () {
  // Mobile menu
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mmenu a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Sticky mobile download bar: show once the hero has scrolled away
  var sticky = document.getElementById('sticky');
  var hero = document.getElementById('hero');
  var final = document.getElementById('download');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroGone = false, finalSeen = false, aboutSeen = false;
    var update = function () { sticky.classList.toggle('show', heroGone && !finalSeen && !aboutSeen); };
    new IntersectionObserver(function (e) { heroGone = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; update(); }, { threshold: 0 }).observe(hero);
    if (final) new IntersectionObserver(function (e) { finalSeen = e[0].isIntersecting; update(); }, { threshold: 0.2 }).observe(final);
    var about = document.getElementById('about');
    if (about) new IntersectionObserver(function (e) { aboutSeen = e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(about);
  }

  // Count App Store button clicks (Meta Pixel custom event, if the Pixel is installed).
  // Note: a click is not a confirmed install.
  document.querySelectorAll('a[data-cta]').forEach(function (a) {
    a.addEventListener('click', function () {
      try {
        if (window.fbq) window.fbq('trackCustom', 'AppStoreClick', { location: a.getAttribute('data-cta') });
      } catch (e) { /* ignore */ }
    });
  });

  // Hero demo video: muted autoplay, synced captions, optional sound
  (function () {
    var v = document.querySelector('video.demo');
    if (!v) return;
    var cap = document.getElementById('demoCap');
    var snd = document.getElementById('demoSnd');
    var playBtn = document.getElementById('demoPlay');
    var steps = [[0, 'Wake up on time'], [2.0, 'Track your water'], [5.1, 'Take a 20-second eye break'], [13.5, 'Stay focused'], [16.6, 'Keep a sleep schedule'], [18.6, 'See your progress'], [21.5, 'Your day, in one app']];
    var cur = -1;
    function setCap(t) {
      var i = 0;
      for (var k = 0; k < steps.length; k++) { if (t >= steps[k][0]) i = k; }
      if (i === cur || !cap) return;
      cur = i;
      cap.classList.add('sw');
      setTimeout(function () { cap.textContent = steps[i][1]; cap.classList.remove('sw'); }, 140);
    }
    v.addEventListener('timeupdate', function () { setCap(v.currentTime); });
    function tryPlay() {
      var p = v.play();
      if (p && p.catch) p.catch(function (err) { if (err && err.name === 'NotAllowedError' && playBtn) playBtn.hidden = false; });
    }
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); if (playBtn) playBtn.hidden = false; }
    else { tryPlay(); }
    v.addEventListener('playing', function () { if (playBtn) playBtn.hidden = true; });
    if (playBtn) playBtn.addEventListener('click', function () { playBtn.hidden = true; tryPlay(); });
    function label() {
      if (!snd) return;
      var on = !v.muted;
      snd.setAttribute('aria-pressed', on ? 'true' : 'false');
      snd.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      snd.querySelector('.t').textContent = on ? 'Sound on' : 'Tap for sound';
    }
    label();
    if (snd) snd.addEventListener('click', function () {
      if (v.muted) { v.muted = false; v.currentTime = 0; tryPlay(); } else { v.muted = true; }
      label();
    });
    // Pause when off-screen or tab hidden (saves battery and data)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        if (reduce && v.paused) return;
        if (e[0].isIntersecting) { if (v.paused && !(playBtn && !playBtn.hidden)) tryPlay(); } else { v.pause(); }
      }, { threshold: 0.15 }).observe(v);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) v.pause(); });
  })();
})();
