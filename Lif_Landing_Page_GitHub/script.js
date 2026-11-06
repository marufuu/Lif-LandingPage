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
})();
