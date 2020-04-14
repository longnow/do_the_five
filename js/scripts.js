const frozenUids = new Set(["eng-000"]);

const transNodes = [...document.querySelectorAll("[contenteditable='true']")];
const initialSearchParams = new URLSearchParams(location.search);
const official = initialSearchParams.get("official") !== null;
const borked = true;

if (borked) {
  if (!official) {
    transNodes.forEach((node) => (node.contentEditable = false));
  }
}

let currUid = initialSearchParams.get("uid") || "eng-000";
let browserUid = "eng-000";
let currId = initialSearchParams.get("id") || "";

const prepTrans = (trans) =>
  Array.isArray(trans)
    ? trans
        .map(([expr, i]) => `<span class="panlexese pl${i}">${expr}</span>`)
        .join(" — ")
    : trans;

const applyTranslations = (transMap) => {
  transNodes.forEach((node) => (node.innerHTML = prepTrans(transMap[node.id])));
  document.title = document.getElementById("stop").textContent;
};

const populateTranslations = () => {
  let url = new URL("https://apps.panlex.org/do_the_five-server/");
  [currUid, browserUid, "eng-000"].forEach(
    (uid) => uid && url.searchParams.append("uid", uid)
  );
  !borked && currId && url.searchParams.append("id", currId);
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      applyTranslations(json);
    });
};

const changeLang = (e) => {
  let newUrl = new URL(location);
  newUrl.searchParams.set("uid", e.target.dataset.uid);
  newUrl.searchParams.delete("id");
  official && newUrl.searchParams.set("official", official);
  location = newUrl;
};

const buildUrl = () => {
  let uid = currUid;
  if (frozenUids.has(uid)) return Promise.reject(new Error("frozen uid"));
  let trans = Array.from(transNodes).reduce(
    (acc, node) => ({ ...acc, [node.id]: node.textContent }),
    {}
  );
  let params = new URLSearchParams();
  params.append("uid", uid);
  for (let key in trans) {
    params.append(key, trans[key]);
  }
  official &&
    params.append(
      "official",
      document.getElementById("official").value.toLowerCase()
    );
  return fetch("https://apps.panlex.org/do_the_five-server/add", {
    method: "POST",
    body: params,
  })
    .then((r) => r.json())
    .then((json) => {
      let newId = json.map((n) => n.toString(36)).join("-");
      let newUrl = new URL(location);
      newUrl.searchParams.set("uid", currUid);
      !borked && newUrl.searchParams.set("id", newId);
      return newUrl;
    });
};

const saveTranslations = () => {
  buildUrl().then(
    (newUrl) => (location = newUrl),
    () => handleFrozenUid()
  );
};

const handleFrozenUid = () => {
  document.getElementById("frozen-uid-warning").style.visibility = "unset";
};

const shareURLBuilders = {
  facebook: (title, url) =>
    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (title, url) =>
    `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
  whatsapp: (title, url) =>
    `whatsapp://send?text=${encodeURIComponent(title + " " + url)}`,
  vk: (title, url) =>
    `http://vk.com/share.php?title=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
  telegram: (title, url) =>
    `https://telegram.me/share/url?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
  weibo: (title, url) =>
    `http://service.weibo.com/share/share.php?title=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
  qq: (title, url) =>
    `http://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
  email: (title, url) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
      url
    )}`,
  weixin: (title, url) => "",
};

const qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 500,
  height: 500,
});

const qrcodeModal = document.getElementById("qrcode-modal");

window.onclick = (e) => {
  if (event.target == qrcodeModal) {
    qrcodeModal.style.display = "none";
  }
};

qrcode.makeCode(location.toString());

const changeShareURL = (e) => {
  let node = e.currentTarget;
  buildUrl().then(
    (newUrl) => {
      newUrl.searchParams.delete("official");
      if (node.id == "weixin") {
        qrcode.makeCode(newUrl.toString());
        qrcodeModal.style.display = "flex";
      } else {
        window.open(
          shareURLBuilders[node.id](
            document.getElementById("stop").textContent,
            newUrl
          ),
          "_blank",
          "noopener"
        );
      }
    },
    () => {
      newUrl = new URL(location);
      newUrl.searchParams.delete("official");
      if (node.id == "weixin") {
        qrcode.makeCode(newUrl.toString());
        qrcodeModal.style.display = "flex";
      } else {
        window.open(
          shareURLBuilders[node.id](
            document.getElementById("stop").textContent,
            newUrl
          ),
          "_blank",
          "noopener"
        );
      }
    }
  );
  e.preventDefault();
};

const getLangvarData = (uid) => {
  fetch("https://api.panlex.org/v2/langvar", {
    method: "POST",
    body: JSON.stringify({ uid, include: "script_expr_txt" }),
  })
    .then((r) => r.json())
    .then((json) => {
      if (json.result) {
        let langvar = json.result[0];
        document.children[0].setAttribute(
          "dir",
          scriptInfo[langvar.script_expr_txt]
        );
        document.getElementById("lang-picker").value = langvar.name_expr_txt;
      }
    });
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
    document
      .getElementById("lang-picker-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        let firstLang = e.target.querySelector("li");
        firstLang && firstLang.click();
      });
    getLangvarData(currUid);
    return populateTranslations();
  })
  .finally(() => {
    document.getElementById("poster-content").style.visibility = "visible";
    if (official) document.getElementById("pw-save").style.display = "flex";
    [...document.getElementsByClassName("app")].forEach((node) => {
      let newUrl = new URL(location);
      newUrl.searchParams.delete("official");
      node.href = shareURLBuilders[node.id](
        document.getElementById("stop").textContent,
        newUrl
      );
      node.addEventListener("click", changeShareURL);
    });
  });
