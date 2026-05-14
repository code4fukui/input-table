# input-table

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A custom HTML element (`<input-table>`) that provides an editable, spreadsheet-like table interface with full CSV support.

## Demo

**Live Demo:** **https://code4fukui.github.io/input-table/**

## Features

-   **Multiple Data Sources**: Initialize data from a CSV string, a URL (`src` attribute), inline `textContent`, or by dragging and dropping a CSV file.
-   **CSV Data Binding**: Get and set the entire table's content as a CSV string using the `.value` property.
-   **Spreadsheet Compatibility**: Copy and paste data directly to and from applications like Google Sheets or Excel.
-   **Interactive Editing**: Add or delete rows and columns with a single click on the headers.
-   **Keyboard Navigation**: Navigate cells efficiently using Arrow keys, Tab, and Shift+Tab.
-   **Programmatic Control**: Manipulate individual cells with `.get(row, col)` and `.set(row, col, value)` methods.
-   **Event-Driven**: Use the `onchange` event to react whenever the table data is modified.
-   **Encoding Support**: Automatically detects and decodes SJIS-encoded CSV files on drop.

## Usage

### Basic Setup

Load the component as a module and add the `<input-table>` tag to your HTML.

```html
<script type="module" src="https://code4fukui.github.io/input-table/input-table.js"></script>

<input-table id="my-table"></input-table>
```

### Initializing Data

There are four ways to populate the table with data:

**1. Using the `.value` property (CSV String)**

```html
<input-table id="table1"></input-table>

<script type="module">
  const table1 = document.getElementById("table1");
  table1.value = "header1,header2\nvalue1,value2\nvalue3,value4";
</script>
```

**2. Using the `src` attribute (URL)**

Load data directly from a remote CSV file.

```html
<input-table src="https://codeforkosen.github.io/kosen-opendata/data/procon/procon2021.csv"></input-table>
```

**3. Using inline `textContent`**

Place your CSV data directly inside the `<input-table>` tags.

```html
<input-table>s,o
abc,33
def,55
</input-table>
```

**4. By Dragging and Dropping**

Users can drag a local `.csv` file and drop it directly onto the component to load its data.

### Getting Data & Handling Events

**Read the `.value` property** to get the current state of the table as a CSV string.

**Listen for the `onchange` event** to be notified whenever the data is modified by the user.

```html
<input-table id="inputtable"></input-table>
<textarea id="csv-output" style="width: 100%; height: 5em;"></textarea>

<script type="module">
  const inputtable = document.getElementById("inputtable");
  const csvOutput = document.getElementById("csv-output");

  // Set initial value
  inputtable.value = "name,date,value\nabc,2021-06-19,100";
  csvOutput.value = inputtable.value;

  // Update textarea when table changes
  inputtable.onchange = () => {
    csvOutput.value = inputtable.value;
  };
</script>
```

### API

#### Properties

-   `.value`: (String) Gets or sets the entire table content as a CSV string.

#### Attributes

-   `src`: (String) The URL of a CSV file to load on initialization.
-   `maxlength`: (Number) The maximum file size in bytes for a dropped CSV file.

#### Methods

-   `.get(row, col)`: Gets the string value of the cell at the specified zero-based coordinates.
-   `.set(row, col, value)`: Sets the value of the cell at the specified zero-based coordinates.

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

## Dependencies

This component relies on the following libraries:

-   [`stdom.js`](https://github.com/code4fukui/stdom) for styling
-   [`CSV.js`](https://github.com/code4fukui/CSV.js) for CSV parsing and encoding
-   [`SJIS.js`](https://github.com/taisukef/sjis-es) for SJIS encoding
-   [`readAsArrayBufferAsync.js`](https://github.com/code4fukui/readAsArrayBufferAsync.js) for reading files

## License

MIT License — see [LICENSE](LICENSE).

---
*This project is an output of [福野泰介の一日一創 (Taisuke Fukuno's daily creation)](https://fukuno.jig.jp/3263).*