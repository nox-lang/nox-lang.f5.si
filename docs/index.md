---
layout: default
title: "ドキュメント"
permalink: /docs/
---
<div class="container prose-page">
  <p class="section__kicker">ドキュメント</p>
  <h1 style="margin-bottom:8px;">Nox を読む</h1>
  <p style="color:rgba(23,20,58,.7); max-width:62ch; margin-bottom:36px;">
    上から順に読む必要はありません。知りたいところから読んでください。
  </p>

  <div class="paths" style="margin-bottom:48px;">
    <a class="path-card plain" href="{{ '/docs/beginners/' | relative_url }}">
      <span class="path-card__tag">初心者向け</span>
      <h3>はじめてのプログラミング</h3>
      <p>プログラミングそのものが初めての方向け。変数・関数・繰り返しの基礎から。</p>
      <span class="go">読む →</span>
    </a>
    <a class="path-card plain" href="{{ '/docs/from-other-languages/' | relative_url }}">
      <span class="path-card__tag">経験者向け</span>
      <h3>他の言語を知っている方へ</h3>
      <p>Python・Go・Rust・C/C++ 経験者向けの早見表つき入門。</p>
      <span class="go">読む →</span>
    </a>
  </div>

  <div class="grid-3">
    <div class="feature">
      <span class="feature__mark">01</span>
      <h3><a href="{{ '/docs/install/' | relative_url }}">インストール</a></h3>
      <p>nox コマンドの入手と、同梱ツールチェーンの仕組み。</p>
    </div>
    <div class="feature">
      <span class="feature__mark">02</span>
      <h3><a href="{{ '/docs/language-tour/' | relative_url }}">言語ツアー</a></h3>
      <p>型・クラス・スライスと配列・マップ・非同期処理までひと通り。</p>
    </div>
    <div class="feature">
      <span class="feature__mark">03</span>
      <h3><a href="{{ '/docs/cli/' | relative_url }}">nox コマンド</a></h3>
      <p><code>init</code> / <code>build</code> / <code>get</code> と、パッケージ・クロスコンパイル。</p>
    </div>
  </div>
</div>
