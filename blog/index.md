---
layout: default
title: "ブログ"
permalink: /blog/
---
<div class="container prose-page">
  <p class="section__kicker">ブログ</p>
  <h1 style="margin-bottom:8px;">お知らせ・開発記録</h1>
  <p style="color:rgba(23,20,58,.7); max-width:60ch; margin-bottom:36px;">Nox 本体・標準ライブラリ・ツールチェーンの更新をまとめています。</p>

  <ul class="post-list">
    {% for post in site.posts %}
    <li class="post-item">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
      <div>
        <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <p>{{ post.excerpt | strip_html | truncate: 110 }}</p>
        {% if post.tags %}
        <div class="tags">
          {% for tag in post.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
        </div>
        {% endif %}
      </div>
    </li>
    {% endfor %}
  </ul>
</div>
