---
title: "他の言語を知っている方へ"
description: "Python・Go・Rust・C/C++ 経験者向けの早見表つき入門。"
order: 3
prev: /docs/beginners/
prev_title: "はじめてのプログラミング"
next: /docs/language-tour/
next_title: "言語ツアー"
---

すでに他の言語でプログラムを書いたことがある方向けのページです。知っている概念との
対応を中心に、Nox 独自の部分を素早くキャッチアップできるようにしています。

## まず全体像

- 静的型付け・強力な型推論（Go の `:=` や Rust の `let` に近い書き味）。
- ソースは C に変換され、同梱の nox-tcc（tcc ベース）でネイティブバイナリになります。
  ランタイムは軽量で、Go ほど大きくありません。
- メモリ管理は自動（ネイティブビルドは Boehm GC）。Rust のような借用チェッカーは
  ありません — 書き味は Go や Java に近いです。
- セミコロンは不要です。改行が文の区切りになります。

## 可視性は「大文字で始まるかどうか」

**Go を知っている方はそのまま**使える規則です。トップレベルの宣言やクラスのメンバーは、
名前が大文字で始まれば公開、小文字で始まればそのファイル／クラスの中だけで使えます。
`private` のようなキーワードはなく、予約語としてこの規則を指すエラーメッセージを出すだけです。

```
class Counter {
    static let Total: int = 0   // 公開
    let name: string            // 非公開（クラスの外から読めない）

    static func Bump(): int {   // 公開
        Counter.Total += 1
        return Counter.Total
    }
}
```

標準ライブラリも同じ規則に従うため、`io::Println` のように **パッケージ名は小文字、
関数名は大文字**で始まります（`io` パッケージの `Println` 関数、という Go と同じ発想です）。
プログラムの入り口も `func main()` ではなく **`func Main()`** です。

## 早見表

| やりたいこと           | Python                     | Go                          | Rust                         | Nox                                  |
|------------------------|-----------------------------|------------------------------|--------------------------------|----------------------------------------|
| 変数（型推論）          | `x = 10`                    | `x := 10`                    | `let x = 10;`                  | `let x = 10`                            |
| 型を明示                | `x: int = 10`                | `var x int = 10`             | `let x: i32 = 10;`             | `let x: int = 10`                       |
| 可変長配列              | `list`                      | `[]T`（スライス）             | `Vec<T>`                        | `[]T`（スライス）                        |
| 固定長配列              | —（`list` を流用）           | `[N]T`                        | `[T; N]`                        | `[N]T`                                  |
| 連想配列                | `dict`                      | `map[K]V`                     | `HashMap<K, V>`                 | `map<K, V>`                             |
| 関数定義                | `def f(x):`                  | `func f(x int) int`           | `fn f(x: i32) -> i32`           | `func F(x: int): int`                   |
| クラス／構造体           | `class C:`                   | `type C struct { ... }`       | `struct C { ... } impl C { ... }` | `class C { ... }`                     |
| 例外処理                | `try` / `except`             | 複数戻り値 `(v, err)`          | `Result<T, E>` / `?`            | `try` / `catch` / `?`                   |
| 非同期処理              | `async` / `await`            | goroutine + channel           | `async` / `.await`              | `async` / `await` / `Thread` / `Task`   |
| コンパイル・実行         | インタプリタ                  | `go build`                    | `cargo build`                   | `nox build`                             |

## スライスと配列は別の型です

Go を知っている方には馴染み深い区別です。`[]T` は参照的な可変長のスライス、
`[N]T` は値としてコピーされる固定長の配列です。

```
let xs: []int = [1, 2, 3]      // スライス — 可変長、参照的
let fixed: [3]int = [3]int{1, 2, 3}  // 配列 — 固定長、値としてコピーされる

let big = make([]int, 0, 16)    // 長さ0・容量16のスライスを確保
let view = xs[1:3]              // スライスの一部を切り出す
```

Python の `list` や Rust の `Vec<T>` にあたるのがスライス、C の固定長配列や Rust の
`[T; N]` にあたるのが配列です。

## 連想配列

```
let ages: map<string, int> = {"alice": 30, "bob": 25}
ages["carol"] = 41

for (name, age in ages) {
    io::Printfn("{}: {}", name, age)
}
```

挿入順を保ったまま走査されます（Python 3.7+ の `dict` と同じ感覚です）。

## 関数・クロージャ・エラー処理

Nox のクロージャは無名関数リテラルです。エラーは Rust の `?` によく似た演算子で
呼び出し元へ伝播させ、`try`/`catch` で受け止めます。

```
func load(path) {
    let text = fs::Read(path)?   // 失敗したらここで呼び出し元へエラーを伝播
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

    let double = (x: int) { return x * 2 }
    io::Println(double(21).toString())
}
```

Go のように「関数は複数のエラー値を明示的に返す」のではなく、Rust の `?` に近い形で
書けますが、受け止め方は Python や Java の `try`/`catch` に近い書き味です。

## クラスに継承はありません

Java・C#・Python のようなクラス継承（`extends`）はありません。クラスはフィールドと
メソッドをまとめるだけのシンプルな仕組みで、`static` なフィールド・メソッドを
`ClassName.member` の形で持てます（下の言語ツアーで詳しく扱います）。

## 非同期処理は 2 とおり

`async`/`await`/`parallel` に加えて、C# の `Task` に近い明示的な API も同じランタイムの
上に用意されています。どちらを使っても構いません。

```
async func fetchScore(): int {
    // ...時間のかかる処理...
    return 42
}

func Main() {
    let t1 = fetchScore()          // async func — すぐに Task を返す
    let t2 = Task.Run(() {         // Task.Run — 同じランタイム
        return 100
    })
    io::Println(await t1)
    io::Println(t2.Result)

    let th = Thread.new(() {
        io::Println("バックグラウンドで実行")
    })
    th.Start()
    th.Join()
}
```

C/C++ の pthread を直接使うのに近いのが `Thread`、Go の goroutine 的な使い捨てタスクに
近いのが `Task`、そして Rust の `async`/`.await` に近いのが `async`/`await` です。

## ポインタはありますが、ポインタ演算はありません

C/C++ の経験者向けに補足すると、Nox にも `pointer<T>`・`&`・`*` はありますが、
ポインタ演算（`p + 1` のような操作）はできません。値を指す・参照するための
道具として割り切って使います。

```
let value = 42
let p: pointer<int> = &value
io::Println((*p).toString())
```

## 次に読むもの

[言語ツアー](/docs/language-tour/) で、ここで触れた機能をひと通り詳しく見ていきましょう。
