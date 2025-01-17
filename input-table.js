import { style } from "https://js.sabae.cc/stdom.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { SJIS } from "https://js.sabae.cc/SJIS.js";
import { readAsArrayBufferAsync } from "https://js.sabae.cc/readAsArrayBufferAsync.js";

const listenDropTextFile = (comp, callback) => {
  comp.ondrop = comp.ondragover = async (e) => {
    e.preventDefault();
    if (e.type !== "drop") {
      return;
    }
    const ditems = e.dataTransfer.items;
    for (let i = 0; i < ditems.length; i++) {
      const item = ditems[i];
      if (item.kind !== "file") { // || !item.type.startsWith("text/")) { // NG on windows
        continue;
      }
      const file = item.getAsFile();
      if (!file.name.endsWith(".csv")) {
        continue;
      }
      const bin = new Uint8Array(await readAsArrayBufferAsync(file));
      const data = SJIS.decodeAuto(bin);
      callback(data);
      break; // single file only
    }
  };
};

const copyToClipboard = (text) => {
  const pre = document.createElement("pre");
  pre.style.webkitUserSelect = "auto";
  pre.style.userSelect = "auto";
  pre.textContent = text;
  document.body.appendChild(pre);
  document.getSelection().selectAllChildren(pre);
  const result = document.execCommand("copy");
  document.body.removeChild(pre);
  return result;
};

const makeTable = (ar, chgcallback) => {
  const change = () => {
    if (chgcallback) {
      chgcallback();
    }
  };
  const c = (tag, parent, text, editable) => {
    const res = document.createElement(tag);
    if (parent) {
      parent.appendChild(res);
    }
    if (text) {
      res.textContent = text;
    }
    return res;
  };

  const tbl = c("table");
  tbl.getData = (selected) => {
    const line = [];
    for (let i = 1; i < tbl.childNodes.length - 1; i++) {
      const tr = tbl.childNodes[i];
      const row = [];
      for (let j = 1; j < tr.childNodes.length - 1; j++) {
        const td = tr.childNodes[j];
        if (!selected || td.classList.contains("selected")) {
          row.push(td.textContent);
        }
      }
      if (row.length > 0) {
        line.push(row);
      }
    }
    return line;
  };
  tbl.onkeydown = (e) => {
    if (e.key == "z" && (e.metaKey || e.ctrlKey)) {
      return;
    }
    if (e.key == "Escape") {
      clearSelected();
    }
    if (e.key == "c" && (e.metaKey || e.ctrlKey)) {
      const line = tbl.getData(true);
      if (line.length == 0) {
        return true;
      }
      const csv = CSV.encode(line);
      copyToClipboard(csv);
    }
  };

  const getPos = (ele) => {
    const lines = tbl.childNodes;
    for (let i = 0; lines.length; i++) {
      const rows = lines[i].childNodes;
      for (let j = 0; j < rows.length; j++) {
        if (rows[j] == ele) {
          return { x: j, y: i };
        }
      }
    }
    return null;
  };
  const getElementByPos = (pos) => {
    if (pos.x < 0 || pos.y < 0) {
      return null;
    }
    const lines = tbl.childNodes;
    if (pos.y >= lines.length) {
      return null;
    }
    const rows = lines[pos.y].childNodes;
    if (pos.x >= rows.length) {
      return null;
    }
    return rows[pos.x];
  };
  const setPos = (pos) => {
    const c = getElementByPos(pos);
    if (c) {
      c.focus();
    }
    return c;
  };
  const setupInput = (c) => {
    c.contentEditable = true;
    c.onkeydown = (e) => {
      if (e.shiftKey) {
        return;
      }
      if (e.key == "ArrowUp") {
        const pos = getPos(e.srcElement);
        if (pos && pos.y > 1) {
          pos.y--;
          setPos(pos);
        }
        e.preventDefault();
      } else if (e.key == "ArrowDown") { // } || e.key == "Enter") {
        const pos = getPos(e.srcElement);
        if (pos && pos.y < ar.length + 1) {
          pos.y++;
          setPos(pos);
        }
        e.preventDefault();
      }
    };
    c.onkeyup = (e) => {
      change();
    };
    c.onpaste = (e) => {
      if (e.clipboardData.types.includes("text/rtf")) {
        e.preventDefault();
        return;
      }

      // プレーンテキストを取得
      const plainText = e.clipboardData.getData("text/plain");
      // プレーンテキストを挿入
      const inputBox = c;
      const selection = window.getSelection();
      const start = Math.min(selection.anchorOffset, selection.focusOffset);
      const end = Math.max(selection.anchorOffset, selection.focusOffset);
      const value = inputBox.textContent;
      // 現在のカーソル位置にテキストを挿入
      inputBox.textContent = value.substring(0, start) + plainText + value.substring(end);
      // カーソル位置を調整
      function setCaretPosition(element, position) {
        const range = document.createRange();
        const selection = window.getSelection();

        // テキストノードを取得
        const textNode = element.firstChild;

        // 範囲の開始位置と終了位置を設定
        range.setStart(textNode, position);
        range.setEnd(textNode, position);

        // 選択範囲を適用
        selection.removeAllRanges();
        selection.addRange(range);
      }
      //inputBox.setSelectionRange(start + plainText.length, start + plainText.length);
      setCaretPosition(c, start + plainText.length);
      e.preventDefault();
    };
    c.getPos = () => {
      return getPos(c);
    }
  };
  const clearSelected = () => {
    tbl.querySelectorAll(".selected").forEach(c => c.classList.remove("selected"));
  };
  const setupRowNum = (num) => {
    const handleKeyNum = (e) => {
      if (e.key == "Tab") {
        return;
      }
      if (e.key == "Escape") {
        clearSelected();
        return;
      }
      if (e.key == "Backspace" || e.key == "Delete") {
        tbl.querySelectorAll(".selected").forEach(c => c.remove());
        const th0 = tbl.childNodes[0].childNodes;
        for (let i = 1; i < th0.length - 1; i++) {
          th0[i].textContent = i - 1;
        }
        change();
      }
      e.preventDefault();
    };
    num.contentEditable = true;
    num.onkeydown = handleKeyNum;
    num.onclick = (e) => {
      for (let i = 0; i < tbl.childNodes.length; i++) {
        if (tbl.childNodes[i].childNodes[0].classList.contains("selected")) {
          clearSelected();
          break;
        }
      }
      const x = getPos(e.srcElement).x;
      for (let i = 0; i < tbl.childNodes.length; i++) {
        getElementByPos({ x, y: i }).classList.toggle("selected");
      }
    };
  };
  const setupLineNum = (num) => {
    const handleKeyNum = (e) => {
      if (e.key == "Tab") {
        return;
      }
      if (e.key == "Escape") {
        clearSelected();
        return;
      }
      if (e.key == "Backspace" || e.key == "Delete") {
        tbl.querySelectorAll(".selected").forEach(c => c.parentElement.remove());
        const tr = tbl.childNodes;
        for (let i = 1; i < tr.length - 1; i++) {
          const th = tr[i].childNodes[0];
          th.textContent = i - 1;
        }
        change();
      }
      e.preventDefault();
    };
    num.contentEditable = true;
    num.onkeydown = handleKeyNum;
    num.onclick = (e) => {
      if (tbl.childNodes[0].querySelector(".selected")) {
        clearSelected();
      }
      const y = getPos(e.srcElement).y;
      const tds = tbl.childNodes[y + 1];
      for (let i = 0; i < tds.childNodes.length; i++) {
        getElementByPos({ x: i, y }).classList.toggle("selected");
      }
    };
  };

  const trh = c("tr", tbl);
  const nrow = ar.length > 0 ? ar[0].length : 0;
  const top = c("th", trh);
  top.contentEditable = true;
  top.onkeydown = (e) => {
    if (e.key == "Escape") {
      clearSelected();
    }
    e.preventDefault();
  };
  top.onclick = () => {
    if (tbl.querySelector(".selected")) {
      clearSelected();
    } else {
      for (let i = 0; i < tbl.childNodes.length - 1; i++) {
        const tr = tbl.childNodes[i];
        for (let j = 0; j < tr.childNodes.length - 1; j++) {
          tr.childNodes[j].classList.add("selected");
        }
      }
    }
  };
  for (let i = 0; i < nrow; i++) {
    const num = c("th", trh, i.toString());
    setupRowNum(num);
  }
  const addrow = c("th", trh, "+");
  addrow.style.cursor = "pointer";
  addrow.onclick = () => {
    clearSelected();
    const lines = tbl.childNodes;
    for (let i = 0; i < lines.length; i++) {
      const tr = lines[i];
      const lastrow = tr.childNodes[tr.childNodes.length - 1];
      if (i == 0) {
        const th = c("th");
        th.textContent = tr.childNodes.length - 2;
        tr.insertBefore(th, lastrow);
        setupRowNum(th);
      } else if (i < lines.length - 1) {
        const td = c("td");
        tr.insertBefore(td, lastrow);
        setupInput(td);
      } else {
        const th = c("th");
        tr.insertBefore(th, lastrow);
      }
    }
  };

  for (let i = 0; i < ar.length; i++) {
    const tr = c("tr", tbl);
    const num = c("th", tr, i.toString());
    setupLineNum(num);
    for (let j = 0; j < ar[i].length; j++) {
      const td = c("td", tr, ar[i][j]);
      setupInput(td);
    }
    c("th", tr);
  }

  const trl = c("tr", tbl);
  const addline = c("th", trl, "+");
  for (let i = 0; i < nrow + 1; i++) {
    c("th", trl);
  }
  addline.style.cursor = "pointer";
  addline.onclick = () => {
    clearSelected();
    const tr = c("tr");
    const num = c("th", tr, (tbl.childNodes.length - 2).toString());
    setupLineNum(num);
    const tr0 = tbl.childNodes[0];
    for (let i = 0; i < tr0.childNodes.length - 2; i++) {
      const td = c("td", tr);
      setupInput(td);
    }
    c("th", tr);
    const lasttr = tbl.childNodes[tbl.childNodes.length - 1];
    tbl.insertBefore(tr, lasttr);
  };

  tbl.addColumn = () => {
    addrow.onclick();
  };
  tbl.addRow = () => {
    addline.onclick();
  };
  tbl.getRowCount = () => {
    return tbl.childNodes.length - 2;
  };
  tbl.getColumnCount = () => {
    return tbl.childNodes[0].childNodes.length - 2;
  };

  return tbl;
};

class InputTable extends HTMLElement {
  constructor() {
    super();
    this.style.display = "inline-block";
    
    style({
      "input-table table": {
        "tabel-collapse": "collapse",
        "background-color": "white",
      },
      "input-table th": {
        "backgronud-color": "#8ff",
        border: "1px solid black",
      },
      "input-table tr:nth-child(2)": {
        "font-weight": "bold",
        "background-color": "#eee",
      },
      "input-table td": {
        "background-color": "#fff",
        border: "1px solid black",
        "text-align": "left",
      },
      "input-table .selected": {
        "background-color": "#def",
      }
    });

    const url = this.getAttribute("src");
    if (url) {
      (async () => {
        const data = await CSV.fetch(url);
        this.value = data;
      })();
    } else {
      const data = this.textContent;
      if (data.length >= 0) {
        this.value = data;
      }
    }
    listenDropTextFile(this, (data) => {
      this.value = data;
      this.changed();
    });

    this.onpaste = (e) => {
      if (!e.clipboardData.types.includes("text/rtf")) {
        return;
      }
      //const rtf = e.clipboardData.getData("text/rtf");
      //console.log("pastedText", pastedText, rtf)

      const pastedText = e.clipboardData.getData("text");
      const ss = pastedText.split("\n");
      const pos = e.srcElement.getPos ? e.srcElement.getPos() : { x: 1, y: 1 };
      for (let i = 0; i < ss.length; i++) {
        const ss2 = ss[i].split("\t");
        for (let j = 0; j < ss2.length; j++) {
          const s = ss2[j];
          const x = pos.x + j - 1;
          const y = pos.y + i - 1;
          if (y >= this.tbl.getRowCount()) {
            this.tbl.addRow();
          }
          if (x >= this.tbl.getColumnCount()) {
            this.tbl.addColumn();
          }
          this.set(y, x, s);
        }
      }
      e.preventDefault();
    };
  }
  changed() {
    if (this.onchange != null) {
      this.onchange();
    }
  }
  get value() {
    if (!this.tbl) {
      return "";
    }
    const data = this.tbl.getData();
    return CSV.encode(data);
  }
  set value(array) {
    if (typeof array == "string") {
      const maxlen = this.getAttribute("maxlength");
      if (maxlen != undefined && array.length > maxlen) {
        alert("too big data!");
        //array = ""; // set null data
        return;
      }
      array = CSV.decode(array);
    }
    this.innerHTML = "";
    this.tbl = makeTable(array, () => {
      this.changed();
    });
    this.appendChild(this.tbl);
  }
  get(row, col) {
    const s = this.tbl.childNodes[1 + row].childNodes[1 + col].textContent;
    const res = parseFloat(s);
    if (!isNaN(res)) {
      return res;
    }
    return s;
  }
  set(row, col, v) {
    if (row > this.tbl.childNodes.length - 3 || col > this.tbl.childNodes[1 + row].childNodes.length - 3) {
      return;
    }
    this.tbl.childNodes[1 + row].childNodes[1 + col].textContent = v;
  };
}

customElements.define("input-table", InputTable);

export { InputTable };
