// モバイルナビの開閉 と "/" キーで検索へ
(function () {
  var nav = document.getElementById('site-nav');
  var toggle = document.getElementById('nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    var input = document.getElementById('search-input');
    if (input) {
      e.preventDefault();
      input.focus();
    } else {
      e.preventDefault();
      window.location.href = (window.NOX_BASEURL || '') + '/search/';
    }
  });
})();
