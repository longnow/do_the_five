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
  const url = new URL(URLBASE + ep);
  const headers = new Headers({
    "x-app-name": `panlex-language-picker/2.3.0`,
    "content-type": "application/json",
  });
  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

function debounce(func, delay) {
  let lastCall, lastCallTimer;
  return (...args) => {
    const previousCall = lastCall;
    lastCall = Date.now();
    if (previousCall && lastCall - previousCall <= delay) {
      clearTimeout(lastCallTimer);
    }
    lastCallTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

class PanLexLanguagePicker extends HTMLInputElement {
  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.initialized = true;
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
    if (this.getAttribute("include")) {
      this.include = this.getAttribute("include")
        .split(" ")
        .filter((inc) => validIncludes.has(inc));
    }
    this.debouncedGetSuggestions = debounce.call(this, this.getSuggestions, 500);
    this.addEventListener("input", (e) => this.debouncedGetSuggestions(e.target.value));
    document.addEventListener("click", () => this.closeIfOpen());
  }

  connectedCallback() {
    if (!this.initialized) {
      this.setup();
    }
    if (this.parentElement !== this.container) {
      this.parentElement.insertBefore(this.container, this);
      this.container.appendChild(this);
      this.insertAdjacentElement("afterend", this.lngList);
    }
  }

  getSuggestions(txt) {
    const queryObj = {
      txt: txt,
      pref_trans_langvar: 187,
      include: this.include
    };
    if (this.hasAttribute("limit")) {
      queryObj.limit = this.getAttribute("limit");
    }
    query("/suggest/langvar", queryObj).then((response) => {
      if (response.suggest) {
        const className = this.getAttribute("list-item-class") || "";
        this.lngList.innerHTML = "";
        if (response.suggest.length) {
          response.suggest.forEach((s) => {
            const li = document.createElement("li");
            li.className = className;
            Object.keys(s).forEach(
              (k) => k !== "trans" && (li.dataset[k] = s[k])
            );
            li.dataset.name = s.trans[0].txt;
            li.addEventListener("click", (e) => this.clickSuggestion(e));
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
        } else if (this.hasAttribute("show-not-found")) {
          this.lngList.innerHTML = "";
          const li = document.createElement("li");
          li.className = className;
          li.addEventListener("click", () => this.closeIfOpen());
          const template = document.getElementById("panlex-language-picker-not-found");
          li.innerHTML = template ? template.innerHTML : "not found";
          this.lngList.appendChild(li);
        }
      }
    });
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
