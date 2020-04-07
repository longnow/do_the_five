const transNodes = document.querySelectorAll("[contenteditable='true']");
const initialSearchParams = new URLSearchParams(location.search);
const official = initialSearchParams.get("official");

let currUid = initialSearchParams.get("uid") || "eng-000";
let browserUid = "eng-000";
let currId = initialSearchParams.get("id") || "";
let currDir = initialSearchParams.get("dir") || "ltr";

const prepTrans = (trans) =>
  Array.isArray(trans)
    ? trans
        .map(([expr, i]) => `<span class="panlexese pl${i}">${expr}</span>`)
        .join(" — ")
    : trans;

const applyTranslations = (transMap) => {
  transNodes.forEach((node) => (node.innerHTML = prepTrans(transMap[node.id])));
};

const populateTranslations = () => {
  let url = new URL("https://apps.panlex.org/do_the_five-server/");
  [currUid, browserUid, "eng-000"].forEach(
    (uid) => uid && url.searchParams.append("uid", uid)
  );
  currId && url.searchParams.append("id", currId);
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      applyTranslations(json);
      document.children[0].setAttribute("dir", currDir);
    });
};

const changeLang = (e) => {
  let newUrl = new URL(location);
  newUrl.searchParams.set("uid", e.target.dataset.uid);
  newUrl.searchParams.delete("id");
  official && newUrl.searchParams.set("official", official);
  newUrl.searchParams.set("dir", scriptInfo[e.target.dataset.script_expr_txt]);
  location = newUrl;
};

const saveTranslations = () => {
  let uid = currUid;
  let trans = Array.from(transNodes).reduce(
    (acc, node) => ({ ...acc, [node.id]: node.textContent }),
    {}
  );
  let url = new URL("https://apps.panlex.org/do_the_five-server/add");
  url.searchParams.append("uid", uid);
  for (let key in trans) {
    url.searchParams.append(key, trans[key]);
  }
  official && url.searchParams.append("official", official);
  fetch(url)
    .then((r) => r.json())
    .then((json) => {
      let newId = json.map((n) => n.toString(36)).join("-");
      let newUrl = new URL(location);
      newUrl.searchParams.set("uid", currUid);
      newUrl.searchParams.set("id", newId);
      location = newUrl;
    });
};

const buildUrl = () => {
  let uid = document.getElementById("lang-picker").dataset.uid || browserUid;
  let url = new URL(location);
  url.search = "";
  url.searchParams.append("uid", uid);
  currId && url.searchParams.append("id", currId);
  return url;
};

let scriptInfo;

fetch("script_data.json")
  .then((r) => r.json())
  .then((json) => {
    scriptInfo = json;
  })
  .then(() => {
    document
      .getElementById("lang-picker")
      .addEventListener("language-select", changeLang);
    return populateTranslations();
  })
  .then(
    () =>
      (document.getElementById("poster-content").style.visibility = "visible")
  );
