# input-table

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A custom HTML element that provides an editable table interface.

## Demo
https://code4fukui.github.io/input-table/

## Features
- Set and get table values via CSV
- Move cursor using cursor keys and tab/shift+tab
- Paste data from spreadsheets
- Add and delete rows/columns

## Usage
```html
<script type="module" src="https://code4fukui.github.io/input-table/input-table.js"></script>
<input-table id="inputtable"></input-table>
```

## Data / API
This project uses the following libraries:
- `stdom.js` for styling
- `CSV.js` for CSV parsing and encoding
- `SJIS.js` for SJIS encoding
- `readAsArrayBufferAsync.js` for reading files

## License
MIT License