---
title: "nox コマンド"
description: "init / build / get と、パッケージ構成・クロスコンパイル。"
order: 5
prev: /docs/language-tour/
prev_title: "言語ツアー"
---

## 単一ファイルのビルド

パッケージを作らずに、1 つの `.nox` ファイルだけを試したいときはこちらです。

```
$ nox build hello.nox
compiling -> hello (linux/amd64) via bundled nox-tcc
built hello
```

実行ファイルはソースの隣に作られ、`build/` ディレクトリは作られません。
生成された C のコードも見てみたい場合は `--emit-c` を付けます。

```
$ nox build hello.nox --emit-c
built hello (C source: hello.c)
```

## パッケージを作る

複数ファイルで構成するプログラムは `nox init` で作ります。

```
$ nox init myapp
Created Nox package 'myapp' in ./myapp
$ cd myapp
$ nox build
compiling -> build/myapp (linux/amd64) via bundled nox-tcc
built build/myapp
```

`nox init` が作るのは次の構成です。

```
myapp/
├── nox.toml         # パッケージの設定
└── src/
    └── main.nox     # エントリーポイント
```

`src/` 以下のすべての `.nox` ファイルが 1 つのプログラムとしてまとめてビルドされます
（Go のパッケージと同じ感覚で、ファイルを分けて構いません）。実行ファイルは
`build/<パッケージ名>` に作られます。

## 依存パッケージ: nox get

他のリポジトリを依存パッケージとして使いたいときは `nox get` を使います。

```
$ nox get github.com/user/some-nox-lib
Added github.com/user/some-nox-lib as a dependency (will be cloned to .../nox get の次の nox build 時にクローンされます)
```

`nox get` はこの時点では **`git clone` を行いません**。`nox.toml` に依存関係を
記録するだけです。実際にクローンされるのは、次に `nox build` を実行したときです。

```
$ nox build
nox: cloning https://github.com/user/some-nox-lib.git -> .nox/pkg/github.com/user/some-nox-lib
compiling -> build/myapp (linux/amd64) via bundled nox-tcc
built build/myapp
```

これは「依存関係を宣言する」ことと「実際に取得する」ことを分けるためです。
`nox.toml` を編集してから `nox build` すれば、チームの誰でも同じ依存関係を
再現できます。

## クロスコンパイル

環境変数 `NOX_OS` / `NOX_ARCH` でビルド対象を切り替えます。

```
$ NOX_OS=windows NOX_ARCH=amd64 nox build
compiling -> build/myapp.exe (windows/amd64) via bundled nox-tcc (Windows cross)
built build/myapp.exe
```

初めて Windows 向けにビルドするときだけ、同梱の nox-tcc が自分自身の
`x86_64-win32` クロスターゲットを一度だけビルドします。`async`/`await`/`Thread`/`Task`
を含め、問題なくクロスコンパイルできます（詳しくは [インストール](/docs/install/) を
参照してください）。

## コマンド早見表

| コマンド | 説明 |
|---|---|
| `nox init <name>` | `./<name>/nox.toml` と `./<name>/src/main.nox` を作成 |
| `nox build` | カレントディレクトリのパッケージをビルド（`nox.toml` が必要）。依存関係も先に取得 |
| `nox build <file.nox>` | 単一ファイルをビルド。`build/` は作られない |
| `nox build <file.nox> --emit-c` | 同上 + 生成された C ファイルを残す |
| `nox get <source>` | 依存パッケージを `nox.toml` に登録（取得は次の `build` 時） |

## 環境変数

| 変数 | 説明 |
|---|---|
| `NOX_OS` | ビルド対象の OS（`linux` / `windows` など。既定はビルドを実行している OS） |
| `NOX_ARCH` | ビルド対象のアーキテクチャ（既定はビルドを実行しているアーキテクチャ） |
| `NOX_TCC` | 同梱の nox-tcc の代わりに使う、任意の tcc バイナリへのパス（上級者向け） |

以上で言語ツアーは終わりです。手を動かしながら試したい場合は、コンパイラ
リポジトリの `examples/` ディレクトリにも一通りのサンプルがあります。
