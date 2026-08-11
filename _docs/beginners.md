---
title: "はじめてのプログラミング"
description: "プログラミング自体がはじめての方向けに、Nox のコードで基礎から説明します。"
order: 2
prev: /docs/install/
prev_title: "インストール"
next: /docs/from-other-languages/
next_title: "他の言語を知っている方へ"
---

このページは、プログラミングそのものが初めての方に向けて書いています。
専門用語はできるだけ使う前に説明します。すでに他の言語の経験がある方は、
[他の言語を知っている方へ](/docs/from-other-languages/) のほうが早いかもしれません。

## プログラムとは

プログラムとは、コンピュータへの指示を順番に書いたものです。Nox で書いたプログラムは
`.nox` という拡張子のファイルに保存し、`nox build` というコマンドで実行できる形に変換します。

## はじめの一行

まず、画面に文字を表示するだけのプログラムを書いてみます。`hello.nox` という
ファイルを作り、次のように書いてください。

```
package main

import(
    "io"
)

func Main() {
    io::Println("Hello, World!")
}
```

それぞれの行が何をしているか見ていきましょう。

- `package main` — このファイルが「実行できるプログラム」の一部であることを示します。
- `import("io")` — 画面に文字を表示するための道具（`io` という標準ライブラリ）を読み込みます。
- `func Main() { ... }` — プログラムが実行されたときに、最初に呼ばれる場所です。`{`
  と `}` で囲まれた部分が、実際に実行される内容です。
- `io::Println("Hello, World!")` — `io` ライブラリの `Println`
  という機能を使って、`"Hello, World!"` という文字列を画面に表示します。

保存したら、ターミナルで次のように実行します。

```
$ nox build hello.nox
$ ./hello
Hello, World!
```

`nox build` がプログラムを実行可能な形に変換し（これを「コンパイル」と呼びます）、
`./hello` で実際に実行しています。

## 値と変数

プログラムの中で値を覚えておくために、**変数**を使います。Nox では `let` で変数を作ります。

```
func Main() {
    let name = "Nox"
    let age = 3
    let pi = 3.14
    let isReady = true

    io::Println(name)
    io::Println(age)
}
```

`let name = "Nox"` は「`name` という名前の変数を作り、`"Nox"` という文字列を入れる」
という意味です。Nox はこのとき、右側の値を見て `name` の**型**（値の種類）を自動的に
決めます。文字列なら `string`、整数なら `int`、小数なら `float`、真偽値なら `bool` です。
これを**型推論**と呼びます。型を自分で書きたい場合は、こう書くこともできます。

```
let age: int = 3
```

`let` で作った変数は、後から値を変えることもできます。

```
let count = 0
count = count + 1
count += 1   // count = count + 1 と同じ
```

## 文字列をつなげる

`+` を使うと、文字列同士をつなげられます。

```
let first = "Nox"
let greeting = "Hello, " + first + "!"
io::Println(greeting)   // Hello, Nox!
```

## 条件分岐: if

状況によって処理を変えたいときは `if` を使います。

```
func Main() {
    let score = 82

    if (score >= 90) {
        io::Println("A")
    } else if (score >= 70) {
        io::Println("B")
    } else {
        io::Println("C")
    }
}
```

条件は `(` `)` で、実行する内容は `{` `}` で囲みます。`else if` は好きなだけ
続けられ、最後の `else` は「どれにも当てはまらなかったとき」の処理です。

## 繰り返し: for と while

同じ処理を繰り返すときは `for` や `while` を使います。0 から 4 まで数える例です。

```
func Main() {
    for (i in range(0, 5)) {
        io::Println(i)
    }
}
```

`range(0, 5)` は「0 以上 5 未満の整数」を順番に取り出します。条件が真の間ずっと
繰り返す `while` はこう書きます。

```
func Main() {
    let n = 5
    while (n > 0) {
        io::Println(n)
        n -= 1
    }
    io::Println("発射！")
}
```

途中で繰り返しをやめたいときは `break`、次の回に飛ばしたいときは `next` を使います
（他の言語の `continue` にあたります）。

## 複数の値をまとめる: スライス

複数の値をひとまとめにして扱いたいときは、スライスを使います。

```
func Main() {
    let fruits = ["りんご", "みかん", "ぶどう"]

    for (fruit in fruits) {
        io::Println(fruit)
    }

    io::Println(fruits.length)   // 3
    io::Println(fruits[0])       // りんご
}
```

`[...]` で値を並べるとスライスができ、`for (要素 in スライス)` で順番に取り出せます。
`.length` で個数、`スライス[番号]` で特定の位置の値を取り出せます（最初は `0` 番目です）。

## 処理をまとめる: 関数

同じ処理を何度も書きたくないときは、**関数**として名前を付けてまとめます。

```
func Add(a: int, b: int): int {
    return a + b
}

func Main() {
    let result = Add(3, 4)
    io::Println(result)   // 7
}
```

`func Add(a: int, b: int): int` は「`Add` という関数は、`int` 型の `a` と `b` を
受け取り、`int` 型の値を返す」という意味です。`return` で返す値を指定します。

## ものと機能をまとめる: クラス

関連する値とその値を扱う処理を、ひとつにまとめたいときは**クラス**を使います。

```
class Dog {
    let Name: string
    let Age: int

    func init(name: string, age: int) {
        this.Name = name
        this.Age = age
    }

    func Bark() {
        io::Println(this.Name + " says Woof!")
    }
}

func Main() {
    let pochi = Dog.new("ポチ", 3)
    pochi.Bark()             // ポチ says Woof!
    io::Println(pochi.Age)   // 3
}
```

`Dog.new(...)` で新しい犬（インスタンス）を作り、`init` の中身がそのとき実行されます。
`this` は「今作られているそのもの自身」を指します。作ったあとは `pochi.Bark()` のように、
`.` で機能を呼び出せます。

## 名前の大文字・小文字には意味がある

Nox では、名前が**大文字**で始まるか**小文字**で始まるかで、その名前を
ファイルの外から使えるかどうかが決まります。`Dog` や `Name`、`Bark` のように
大文字で始まる名前は「公開されている」ため、他のファイルやクラスの外からも
使えます。小文字で始まる名前は、そのファイルやクラスの中だけで使えます。

## 次に読むもの

ここまでで、Nox の基本的な部品はひと通り出てきました。次は
[言語ツアー](/docs/language-tour/) で、型やクラス、非同期処理などをもう少し詳しく
見ていきましょう。
