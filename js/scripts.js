const transNodes = [...document.querySelectorAll("[contenteditable='true']")];
const initialSearchParams = new URLSearchParams(location.search);
const official = typeof initialSearchParams.get("official") !== "undefined";

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

const buildUrl = () => {
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
  official &&
    url.searchParams.append(
      "official",
      document.getElementById("official").value.toLowerCase()
    );
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      let newId = json.map((n) => n.toString(36)).join("-");
      let newUrl = new URL(location);
      newUrl.searchParams.set("uid", currUid);
      newUrl.searchParams.set("id", newId);
      return newUrl;
    });
};

const saveTranslations = () => {
  buildUrl().then((newUrl) => (location = newUrl));
};

// const buildUrl = () => {
//   let uid = document.getElementById("lang-picker").dataset.uid || browserUid;
//   let url = new URL(location);
//   url.search = "";
//   url.searchParams.append("uid", uid);
//   currId && url.searchParams.append("id", currId);
//   return url;
// };

// const twitterShare = e => {
//   e.href = "https://twitter.com/intent/tweet/?text=BlahBlahBlah&amp;url=https%3A%2F%2Fapps.panlex.org%2Fdo_the_five";
// }

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
};

const changeShareURL = (e) => {
  let node = e.currentTarget;
  buildUrl().then((newUrl) => {
    // console.log(node);
    // node.href = shareURLBuilders[node.id](
    //   document.getElementById("stop").textContent,
    //   newUrl
    // );
    window.open(
      shareURLBuilders[node.id](
        document.getElementById("stop").textContent,
        newUrl
      ),
      "_blank"
    );
  });
  e.preventDefault();
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
  .then(() => {
    document.getElementById("poster-content").style.visibility = "visible";
    if (official) document.getElementById("official").style.display = "unset";
    [...document.getElementsByClassName("app")].forEach((node) =>
      node.addEventListener("click", changeShareURL)
    );
  });
