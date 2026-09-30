# nox-lang.f5.si — Nox 公式サイト

[Nox](https://github.com/nox-lang/nox) 言語の公式サイトです。Jekyll で構築し、
GitHub Pages（カスタムドメイン: `nox-lang.f5.si`、`CNAME` 参照）でホストします。

## 構成

```
_docs/            ドキュメント（コレクション。/docs/:path/ に出力）
_posts/           ブログ記事
_layouts/         default / home / page / doc / post / search
_includes/        head・nav・footer・アイコン SVG など
_sass/, assets/css/main.scss   スタイル（トークン→ベース→各コンポーネント）
assets/js/        main.js（ナビ開閉・"/" で検索へ）/ toc.js（目次自動生成）/ search.js（検索）
search-index.json 検索用インデックス（ビルド時に _docs + _posts から自動生成）
docs/index.md     ドキュメントのトップ（上記コレクションとは別の通常ページ）
blog/index.md     ブログ一覧
search/index.md   検索ページ
assets/images/    ロゴ・favicon（アップロードされたロゴから生成）
```

## ローカルで動かす

```
$ bundle install
$ bundle exec jekyll serve
```

`http://localhost:4000` で確認できます。

## 検索について

Algolia などの外部サービスは使わず、ビルド時に Jekyll が `search-index.json`
（`_docs` と `_posts` の全文）を生成し、`assets/js/search.js` がブラウザ側で
単純なスコアリング検索を行う、依存ライブラリなしの実装です。GitHub Pages の
ような静的ホスティングだけで完結します。

## 新しいドキュメントページを追加する

`_docs/` に Markdown ファイルを追加してください（front matter に `title` /
`description` / 必要なら `prev` / `prev_title` / `next` / `next_title`）。
見出し（`##` / `###`）は自動で目次になります。

## 新しいブログ記事を追加する

`_posts/YYYY-MM-DD-slug.md` を追加してください（front matter に `title` /
`date` / 任意で `tags`）。`/blog/` の一覧と検索に自動で反映されます。

## デプロイ

`main` ブランチへの push で GitHub Pages が自動ビルドします。カスタムドメイン
`nox-lang.f5.si` を使う場合は、リポジトリの Settings → Pages で
`nox-lang.f5.si` を指すよう DNS（CNAME レコード）を設定してください。
