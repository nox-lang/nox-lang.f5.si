---
title: "Nox: 型推論を持つコンパイル言語、はじめました"
date: 2026-08-10 10:00:00 +0900
tags: [リリース]
---

Nox という、静的型付け・強力な型推論を持つプログラミング言語のコンパイラを
公開しました。Go で書かれたコンパイラが Nox のソースを C に変換し、
[tcc](https://bellard.org/tcc/)（Tiny C Compiler）でネイティブバイナリに
仕上げます。

```
package main

import(
    "io"
)

func main() {
    io::println("Hello, World!")
}
```

型を手で書く手間を型推論に任せ、コンパイルの速さも大事にしています。クラス、
配列、クロージャ、`try`/`catch`/`?` によるエラー処理、`async`/`await`/`parallel`
による非同期処理まで、実用的なプログラムを書くのに必要な機能はひと通り揃っています。

これからも継続して機能を足していく予定です。フィードバックは
[GitHub のリポジトリ]({{ site.github_repo }})までお願いします。
