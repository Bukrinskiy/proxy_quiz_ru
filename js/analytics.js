(function () {
  const analytics = {
    track(eventName, payload) {
      console.log('[analytics]', eventName, payload || {});
    }
  };

  window.analytics = analytics;

  analytics.track('view_entry_hero');
})();
