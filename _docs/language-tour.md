---
title: "言語ツアー"
description: "型・クラス・スライスと配列・マップ・非同期処理まで、ひと通り見ていきます。"
order: 4
prev: /docs/from-other-languages/
prev_title: "他の言語を知っている方へ"
next: /docs/cli/
next_title: "nox コマンド"
---

Nox の言語機能をひと通り、コード例とともに見ていきます。上から順に読んでも、
気になる見出しだけつまんでも構いません。

## パッケージと import

すべてのファイルは `package main` で始まります。標準ライブラリは `import(...)` で
読み込み、`パッケージ名::関数名` の形で呼び出します。

```
package main

import(
    "io"
    "math"
)

func Main() {
    io::Println(math::Sqrt(2.0))
}
```

標準ライブラリは `io`・`random`・`fs`・`path`・`math`・`time` の 6 パッケージです。
既存の C の関数をそのまま呼びたい場合は `include` を使います（下記「C との連携」）。

## let と型推論

`let` は値から型を推論します。明示したい場合は `let 名前: 型 = 値` と書きます。

```
let count = 0          // int
let ratio = 0.5         // float
let label = "score"     // string
let ready = true        // bool
let count: int = 0      // 明示してもよい
```

再代入は `=`、複合代入は `+= -= *= /=` が使えます。値を捨てたいときはブランク変数
`_` を使います（代入先としてのみ使え、読み出すことはできません）。

```
let _ = doSomething()          // 戻り値を捨てる
for (_, value in items) {      // インデックスを使わない
    io::Println(value)
}
```

## 型エイリアス

`type` で既存の型に別名を付けられます（Go の `type` と同じ発想です）。

```
type UserID = int
type Score = int

let id: UserID = 42
```

## 演算子と if

比較演算子は `== != < <= > >=`、論理演算子は `&& || !` です。`if` は文としても
**式**としても使えます。

```
if (score >= 90) {
    io::Println("A")
} else if (score >= 70) {
    io::Println("B")
} else {
    io::Println("C")
}

// 式として: 各分岐の最後の式がそのまま値になる
let grade = if (score >= 90) {
    "A"
} else {
    "B"
}
```

## 繰り返し: for / while / range

```
for (i in range(0, 5)) { io::Println(i) }        // 0, 1, 2, 3, 4
for (i in range(10, 0, -2)) { io::Println(i) }    // 10, 8, 6, 4, 2

for (fruit in fruits) { io::Println(fruit) }
for (index, fruit in fruits) { io::Println(index) }
for (key, value in ages) { io::Println(key) }     // map も同じ書き方

let n = 3
while (n > 0) { n -= 1 }
```

`for` は **式としても**使えます。`break 値` でループを打ち切って値を返し、
`next 値` はスキップしつつその回の値を結果のスライスへ積みます。

```
let found = for (x in [1, 2, 30, 4]) {
    if (x > 10) { break x }
}
// found == 30

let doubled = for (x in [1, 2, 3]) {
    next x * 2
}
// doubled == [2, 4, 6]
```

## switch

```
switch (dog.Age) {
    case 4 {
        io::Println("four")
    }
    case 5, 6 {
        io::Println("five or six")
    }
    default {
        io::Println("other")
    }
}

// 式として使う場合は break で値を返す
let label = switch (dog.Age) {
    case 4 { break "young" }
    default { break "old" }
}
```

## 関数

引数には型を書きます。デフォルト値・可変長引数（`...`）も使えます。

```
func Add(a: int, b: int): int {
    return a + b
}

func Greet(name = "World") {
    return "Hello, " + name
}

func Sum(values...) {
    let total = 0
    for (v in values) { total += v }
    return total
}
```

クロージャ（無名関数）はその場に書けます。周りの変数を捕まえられます。

```
let n = 100
let addN = (x: int) {
    return x + n
}
io::Println(addN(5).toString())   // 105
```

## クラス

フィールドは `let`、メソッドは `func` で宣言します。コンストラクタは
`init`、インスタンスは `ClassName.new(...)` で作ります。

```
class Dog {
    let Name: string
    let age: int          // 小文字 = クラスの外からは読めない

    func init(name: string, age: int) {
        this.Name = name
        this.age = age
    }

    func Bark() {
        io::Println(this.Name + " says Woof!")
    }
}

let pochi = Dog.new("Pochi", 3)
pochi.Bark()
```

### static なフィールド・メソッド

`static` を付けると、個々のインスタンスではなくクラス自体に属する
フィールド・メソッドになります。`ClassName.member` の形でアクセスします。

```
class Counter {
    static let Total: int = 0

    static func Bump(): int {
        Counter.Total += 1
        return Counter.Total
    }
}

Counter.Bump()
Counter.Bump()
io::Println(Counter.Total.toString())   // 2
```

static フィールドは、インスタンスを作らなくても存在するため、型を省略できません。

## スライス・配列・マップ

`[]T` は可変長のスライス、`[N]T` は固定長の配列（値としてコピーされます）です。

```
let xs: []int = [1, 2, 3, 4, 5]
xs.push(6)
io::Println(xs.length)                 // 6
let view = xs[1:3]                      // スライスの一部を切り出す
let big = make([]int, 0, 16)            // 長さ0・容量16を確保

let fixed: [3]int = [3]int{1, 2, 3}     // 固定長配列
fixed[0] = 99                           // 書き換え可能（値としてコピーされる点に注意）
```

スライスには `.push` `.pop` `.each` `.map` `.filter` `.find` `.sort` `.reverse`
`.contains` などのメソッドがあります。

連想配列は `map<K, V>` です。

```
let ages: map<string, int> = {"alice": 30, "bob": 25}
ages["carol"] = 41
io::Println(ages.length)

for (name, age in ages) {
    io::Printfn("{}: {}", name, age)
}
```

## ポインタ

`pointer<T>`・`&`（アドレス取得）・`*`（参照外し）が使えます。ポインタ演算はありません。

```
let value = 42
let p: pointer<int> = &value
io::Println((*p).toString())
```

## エラー処理: try / catch / ?

失敗する可能性のある呼び出しには `?` を付けます。関数内で使うと、失敗時に
その関数の呼び出し元までエラーが伝播します。受け止めるには `try`/`catch` を使います。

```
func load(path) {
    let text = fs::Read(path)?
    return text
}

func Main() {
    try {
        let text = load("might_not_exist.txt")
        io::Println(text)
    } catch (error) {
        io::Println("caught error:")
        io::Println(error)
    }
}
```

## defer

`defer { ... }` は、そのブロックを抜けるときに実行される処理を予約します。
複数ある場合は、書いた順と**逆順**（LIFO）に実行されます。

```
func Main() {
    defer { io::Println("cleanup 1") }
    defer { io::Println("cleanup 2") }
    io::Println("main body done")
}
// main body done
// cleanup 2
// cleanup 1
```

## 非同期処理

`async`/`await`/`parallel` と、`Thread`/`Task` は同じランタイムを共有する、
2 とおりの書き方です。自由に組み合わせられます。

```
async func FetchScore(): int {
    return 42
}

func Main() {
    let t = FetchScore()
    io::Println(await t)

    let results = await parallel {
        FetchScore()
        FetchScore()
    }

    let task = Task.Run(() {
        return 7 * 6
    })
    io::Println(task.Result)

    let all = Task.WhenAll(tasks)   // []Task<T> -> Task<[]T>

    let th = Thread.new(() {
        io::Println("バックグラウンドで実行")
    })
    th.Start()
    th.Join()
}
```

## C との連携: include

既存の C の関数をそのまま呼びたい場合は `include` を使います。

```
package main

include(
    "stdio.h"
)

func Main() {
    stdio::printf("raw C printf: %d\n", 123)
}
```

## 次に読むもの

最後に [nox コマンド](/docs/cli/) で、`init`・`build`・`get` の使い方と
パッケージ構成を見ていきましょう。
