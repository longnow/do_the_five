const VERSION = 2;
const APISERVER = "https://api.panlex.org";
const URLBASE = VERSION === 2 ? APISERVER + "/v2" : APISERVER;

const validIncludes = new Set([
  "expr_count",
  "grp",
  "meaning",
  "mutable",
  "name_expr",
  "region_expr",
  "region_expr_langvar",
  "region_expr_txt",
  "script_expr",
  "script_expr_langvar",
  "script_expr_txt",
]);

function query(ep, params, get = false) {
  let url = new URL(URLBASE + ep);
  let headers = new Headers({
    "x-app-name": `panlex-language-picker/2.3.0`,
    "content-type": "application/json",
  });
  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

class PanLexLanguagePicker extends HTMLInputElement {
  constructor() {
    super();
    this.container = document.createElement("div");
    this.container.className = "panlex-language-picker";
    this.container.innerHTML = `
    <style>
      .panlex-language-picker {
        display: inline-block;
      }

      .panlex-language-picker > ul {
        padding: unset;
        margin: unset;
        list-style-type: none;
        position: absolute;
        background-color: white;
      }

      .panlex-language-picker li > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    </style>
    `;
    this.lngList = document.createElement("ul");
    this.lngList.className = this.getAttribute("list-class") || "";
    this.lastValue = this.value;
    if (this.getAttribute("include"))
      this.include = this.getAttribute("include")
        .split(" ")
        .filter((inc) => validIncludes.has(inc));
    this.addEventListener("input", this.debouncedGetSuggestions.bind(this));
    document.addEventListener("click", () => this.closeIfOpen());
  }

  connectedCallback() {
    if (this.parentElement !== this.container) {
      this.parentElement.insertBefore(this.container, this);
      this.container.appendChild(this);
      this.insertAdjacentElement("afterend", this.lngList);
    }
  }

  debounce(func, delay) {
    return (args) => {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();
      if (previousCall && this.lastCall - previousCall <= delay) {
        clearTimeout(this.lastCallTimer);
      }
      this.lastCallTimer = setTimeout(func, delay, args);
    };
  }

  getSuggestions(txt) {
    query("/suggest/langvar", {
      txt: txt,
      pref_trans_langvar: 187,
      include: this.include,
    }).then((response) => {
      if (response.suggest) {
        this.lngList.innerHTML = "";
        response.suggest.forEach((s) => {
          let li = document.createElement("li");
          li.className = this.getAttribute("list-item-class") || "";
          Object.keys(s).forEach(
            (k) => k !== "trans" && (li.dataset[k] = s[k])
          );
          li.dataset.name = s.trans[0].txt;
          li.addEventListener("click", this.clickSuggestion.bind(this));
          li.innerHTML = `
          <div>
            <span>
              ${s.trans[0].txt}
            </span>
            <span>
              ${s.uid}
            </span>
          </div>
          <div>
            ${
              s.trans
                .slice(1)
                .map((tran) => tran.txt)
                .join(" — ") || "&nbsp;"
            }
          </div>
          `;
          this.lngList.appendChild(li);
        });
      }
    });
  }

  debouncedGetSuggestions(e) {
    this.debounce(this.getSuggestions.bind(this), 500)(e.target.value);
  }

  clickSuggestion(e) {
    Object.keys(e.currentTarget.dataset).forEach(
      (k) => (this.dataset[k] = e.currentTarget.dataset[k])
    );
    this.closeWithValue(e.currentTarget.dataset.name);
    this.dispatchEvent(new Event("language-select"));
    e.stopPropagation();
  }

  closeWithValue(value) {
    this.value = this.lastValue = value;
    this.lngList.innerHTML = "";
  }

  closeIfOpen() {
    if (this.lngList.children.length) {
      this.closeWithValue(this.lastValue);
    }
  }
}

window.customElements.define("panlex-language-picker", PanLexLanguagePicker, {
  extends: "input",
});
