# input-table

完全なCSVサポートを備え、スプレッドシートのように編集可能なテーブルインターフェースを提供するカスタムHTML要素（`<input-table>`）です。

## デモ

**ライブデモ:** **https://github.com/code4fukui/input-table

## 機能

- **複数のデータソース**: CSV文字列、URL（`src`属性）、インラインの `textContent`、またはCSVファイルのドラッグ＆ドロップでデータを初期化できます。
- **CSVデータバインディング**: `.value`プロパティを使用して、テーブル全体の内容をCSV文字列として取得または設定できます。
- **スプレッドシートとの互換性**: Google SheetsやExcelなどのアプリケーションとの間でデータを直接コピー＆ペーストできます。
- **インタラクティブな編集**: ヘッダーを1回クリックするだけで、行や列を追加または削除できます。
- **キーボードナビゲーション**: 矢印キー、Tab、Shift+Tabを使用してセルを効率的に移動できます。
- **プログラムからの制御**: `.get(row, col)` および `.set(row, col, value)` メソッドを使用して個々のセルを操作できます。
- **イベント駆動**: テーブルデータが変更されるたびに `onchange` イベントを使用して処理を実行できます。
- **エンコーディング対応**: ドロップされたShift_JISエンコードのCSVファイルを自動的に検出し、デコードします。

## 使い方

### 基本的なセットアップ

コンポーネントをモジュールとして読み込み、HTMLに `<input-table>` タグを追加します。

```html
<script type="module" src="https://code4fukui.github.io/input-table/input-table.js"></script>

<input-table id="my-table"></input-table>
```

### データの初期化

テーブルにデータを設定する方法は4つあります：

**1. `.value` プロパティを使用（CSV文字列）**

```html
<input-table id="table1"></input-table>

<script type="module">
  const table1 = document.getElementById("table1");
  table1.value = "header1,header2\nvalue1,value2\nvalue3,value4";
</script>
```

**2. `src` 属性を使用（URL）**

リモートのCSVファイルからデータを直接読み込みます。

```html
<input-table src="https://codeforkosen.github.io/kosen-opendata/data/procon/procon2021.csv"></input-table>
```

**3. インラインの `textContent` を使用**

CSVデータを `<input-table>` タグ内に直接配置します。

```html
<input-table>s,o
abc,33
def,55
</input-table>
```

**4. ドラッグ＆ドロップによる読み込み**

ユーザーはローカルの `.csv` ファイルをコンポーネントに直接ドラッグ＆ドロップしてデータを読み込むことができます。

### データの取得とイベント処理

**`.value` プロパティを読み取る**ことで、テーブルの現在の状態をCSV文字列として取得できます。

**`onchange` イベントをリッスンする**ことで、ユーザーがデータを変更したときに検知できます。

```html
<input-table id="inputtable"></input-table>
<textarea id="csv-output" style="width: 100%; height: 5em;"></textarea>

<script type="module">
  const inputtable = document.getElementById("inputtable");
  const csvOutput = document.getElementById("csv-output");

  // 初期値を設定
  inputtable.value = "name,date,value\nabc,2021-06-19,100";
  csvOutput.value = inputtable.value;

  // テーブルが変更されたときにテキストエリアを更新
  inputtable.onchange = () => {
    csvOutput.value = inputtable.value;
  };
</script>
```

### API

#### プロパティ

- `.value`: （文字列）テーブル全体の内容をCSV文字列として取得または設定します。

#### 属性

- `src`: （文字列）初期化時に読み込むCSVファイルのURL。
- `maxlength`: （数値）ドロップされたCSVファイルの最大バイト数。

#### メソッド

- `.get(row, col)`: 指定された0始まりの座標（インデックス）にあるセルの文字列値を取得します。
- `.set(row, col, value)`: 指定された0始まりの座標（インデックス）にあるセルの値を設定します。

```html
<input-table id="table4">s,o
abc,33
def,55
</input-table>
<button id="btnget">Get (1, 1)</button>
<button id="btnset">Set (1, 1) to "12345"</button>

<script type="module">
  const table4 = document.getElementById("table4");
  btnget.onclick = () => alert("Cell (1, 1) value: " + table4.get(1, 1));
  btnset.onclick = () => table4.set(1, 1, "12345");
</script>
```

## 依存関係

このコンポーネントは以下のライブラリに依存しています：

- [`stdom.js`](https://github.com/code4fukui/stdom) スタイリング用
- [`CSV.js`](https://github.com/code4fukui/CSV.js) CSVの解析とエンコード用
- [`SJIS.js`](https://github.com/taisukef/sjis-es) Shift_JISエンコード用
- [`readAsArrayBufferAsync.js`](https://github.com/code4fukui/readAsArrayBufferAsync.js) ファイルの読み込み用

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。

---
*このプロジェクトは [福野泰介の一日一創 (Taisuke Fukuno's daily creation)](https://fukuno.jig.jp/3263) の成果です。*
