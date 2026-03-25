(function () {
  const cta = document.getElementById('pick-proxy-btn');

  if (!cta) return;

  cta.addEventListener('click', function () {
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('click_cta_pick_proxy');
    }
  });
})();
