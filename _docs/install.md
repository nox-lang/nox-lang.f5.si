---
title: "インストール"
description: "nox コマンドの入手方法と、同梱ツールチェーンの仕組み。"
order: 1
next: /docs/beginners/
next_title: "はじめてのプログラミング"
---

## 必要なもの

Nox のコンパイラ本体は Go で書かれています。ビルドに外部の Go モジュールは
使っていないので、オフラインでもビルドできます。

```
$ go build -o nox ./cmd/nox
```

できた `nox` を `PATH` の通った場所に置けば準備完了です。

## nox-tcc は同梱されています

Nox のプログラムは「Nox → C → ネイティブバイナリ」という流れでコンパイルされます。
この最後の「C → ネイティブバイナリ」を担うのが **nox-tcc**（[tcc](https://bellard.org/tcc/) を
ベースにした C コンパイラ）ですが、これは `nox` バイナリの中に**ソースごと同梱**されています。
別途 `tcc` をインストールする必要はありません。

初めて `nox build` を実行したとき、`nox` は次のことを自動的に行います。

1. 同梱している nox-tcc のソースをユーザーごとのキャッシュディレクトリに展開する
2. そのソースから nox-tcc をビルドする（一度だけ）
3. 2回目以降のビルドはキャッシュされたバイナリをそのまま使う

この「一度だけのビルド」のために、**ホスト側に何らかの C コンパイラ**（`cc` /
`gcc` / `clang` のいずれか）が必要です。ほとんどの開発機にはどれかが既に
入っています。nox-tcc 自体を手動でインストールする必要はもうありません。

```
$ nox build hello.nox
compiling -> hello (linux/amd64) via bundled nox-tcc
built hello
```

## Windows 向けクロスコンパイル

環境変数 `NOX_OS=windows` を付けるだけで、Windows 向けの実行ファイルを生成できます。

```
$ NOX_OS=windows NOX_ARCH=amd64 nox build hello.nox
compiling -> hello.exe (windows/amd64) via bundled nox-tcc (Windows cross)
built hello.exe
```

初めて Windows 向けにビルドするときは、nox-tcc 自身が持つ
`x86_64-win32` クロスターゲットを同じソースからもう一度ビルドします（これも一度だけ）。
`async`/`await`/`parallel` や `Thread`/`Task` を使ったプログラムも、Windows 向けに
問題なくコンパイル・実行できます。

## 動作に必要なライブラリ（ネイティブビルドのみ）

Windows 向けビルドでは、GC を使わない実装に自動的に切り替わるため、追加のライブラリは
必要ありません。**ネイティブ（非 Windows）ビルドのみ**、次の 2 つが必要です。

- **[Boehm GC](https://www.hboehm.info/gc/)**（`libgc`）— Nox の自動メモリ管理
- **pthreads** — `async`/`await`/`parallel`・`Thread`/`Task` に使用（ほとんどの Linux/macOS には標準で入っています）

Debian/Ubuntu であれば、次の一行で揃います。

```
$ sudo apt install libgc-dev
```

準備ができたら、[はじめてのプログラミング](/docs/beginners/) または
[他の言語を知っている方へ](/docs/from-other-languages/) に進んでください。
