// ドキュメント記事の見出し(h2/h3)から目次を自動生成し、
// スクロール位置に応じて現在地をハイライトする。
(function () {
  var content = document.getElementById('doc-content');
  var list = document.getElementById('toc-list');
  var toc = document.getElementById('toc');
  if (!content || !list) return;

  var headings = content.querySelectorAll('h2, h3');
  if (!headings.length) {
    if (toc) toc.style.display = 'none';
    return;
  }

  var ul = document.createElement('ul');
  var links = [];
  for (var i = 0; i < headings.length; i++) {
    var h = headings[i];
    if (!h.id) {
      h.id = 'section-' + i;
    }
    var li = document.createElement('li');
    if (h.tagName === 'H3') li.className = 'toc--sub';
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ul.appendChild(li);
    links.push({ el: h, a: a });
  }
  list.appendChild(ul);

  var onScroll = function () {
    var pos = window.scrollY + 96;
    var current = null;
    for (var i = 0; i < links.length; i++) {
      if (links[i].el.offsetTop <= pos) current = links[i];
    }
    for (var i = 0; i < links.length; i++) {
      links[i].a.classList.remove('active');
    }
    if (current) current.a.classList.add('active');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
