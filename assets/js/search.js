// 依存ライブラリなしの単純な検索。search-index.json を取得し、
// タイトル一致を高く重み付けした部分一致でスコアリングする。
(function () {
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var metaEl = document.getElementById('search-meta');
  if (!input || !resultsEl) return;

  var baseurl = window.NOX_BASEURL || '';
  var indexData = null;
  var indexPromise = fetch(baseurl + '/search-index.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { indexData = data; return data; })
    .catch(function () {
      metaEl.textContent = '検索インデックスの読み込みに失敗しました。';
      return [];
    });

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function excerpt(content, query) {
    var lower = content.toLowerCase();
    var idx = lower.indexOf(query.toLowerCase());
    var start = idx === -1 ? 0 : Math.max(0, idx - 60);
    var snippet = content.substring(start, start + 160);
    if (start > 0) snippet = '…' + snippet;
    if (start + 160 < content.length) snippet = snippet + '…';
    return snippet;
  }

  function highlight(text, query) {
    var escaped = escapeHtml(text);
    if (!query) return escaped;
    var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return escaped.replace(re, '<mark>$1</mark>');
  }

  function search(query) {
    var q = query.trim().toLowerCase();
    if (!q) return [];
    var terms = q.split(/\s+/).filter(Boolean);
    var scored = [];
    indexData.forEach(function (item) {
      var title = (item.title || '').toLowerCase();
      var content = (item.content || '').toLowerCase();
      var score = 0;
      terms.forEach(function (t) {
        if (title.indexOf(t) !== -1) score += 10;
        var count = content.split(t).length - 1;
        score += Math.min(count, 5) * 2;
      });
      if (score > 0) scored.push({ item: item, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.map(function (s) { return s.item; });
  }

  function render(query) {
    var q = query.trim();
    if (!q) {
      resultsEl.innerHTML = '';
      metaEl.textContent = '';
      return;
    }
    var results = search(q);
    metaEl.textContent = results.length + ' 件見つかりました — "' + q + '"';
    if (!results.length) {
      resultsEl.innerHTML = '<li class="search-empty">一致する結果が見つかりませんでした。別のキーワードをお試しください。</li>';
      return;
    }
    resultsEl.innerHTML = results.slice(0, 30).map(function (item) {
      return '<li>' +
        '<span class="path">' + escapeHtml(item.section) + '</span>' +
        '<h3><a href="' + item.url + '">' + highlight(item.title, q) + '</a></h3>' +
        '<p>' + highlight(excerpt(item.content, q), q) + '</p>' +
        '</li>';
    }).join('');
  }

  function paramQuery() {
    var m = window.location.search.match(/[?&]q=([^&]+)/);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  }

  var initial = paramQuery();
  if (initial) input.value = initial;

  indexPromise.then(function () {
    if (input.value) render(input.value);
  });

  var timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    var v = input.value;
    timer = setTimeout(function () {
      var url = new URL(window.location.href);
      if (v) url.searchParams.set('q', v); else url.searchParams.delete('q');
      window.history.replaceState({}, '', url);
      if (indexData) render(v);
    }, 120);
  });
})();
