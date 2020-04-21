const backend = "https://apps.panlex.org/do_the_five-server";
const borked = true;

const windowTop = window.top;
const transNodes = [...document.querySelectorAll("[contenteditable='true']")];
const initialSearchParams = new URLSearchParams(windowTop.location.search);
const official = initialSearchParams.get("official") !== null;

if (borked) {
  if (!official) {
    transNodes.forEach((node) => (node.contentEditable = false));
    document.getElementById("email-form").style.display = "none";
  }
}

const defaultUid = "eng-000";
const fallbackUid = "eng-000";
const currUid = initialSearchParams.get("uid") || defaultUid;
const browserUid = defaultUid;
const currId = initialSearchParams.get("id") || "";
let currLangvar = {};
const panlexeseMap = {};

const borkedError = new Error("borked-error");
const frozenUidError = new Error("frozen-uid-error");
const passwordEmptyError = new Error("pw-empty-error");
const panlexeseError = new Error("panlexese-error");
const titleError = new Error("title-error");

let lastTarget;

const initFromFrame = () => {
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    link = link.cloneNode();
    link.setAttribute("href", link.href);
    windowTop.document.head.appendChild(link);
  });

  const div = windowTop.document.createElement("div");
  div.id = "do_the_five";
  document.querySelectorAll(".overlay").forEach((popup) => {
    div.appendChild(popup);
  });
  windowTop.document.body.appendChild(div);
};

const toTarget = windowTop.toTarget = (target) => {
  const savedScrollY = windowTop.scrollY;
  const url = new URL(windowTop.location);
  url.hash = target || "";
  if (!target) {
    url.href += "#";
  }
  windowTop.location.replace(url);
  url.hash = "";
  windowTop.history.replaceState(null, "", url);
  if (windowTop.scrollY !== savedScrollY) {
    windowTop.scroll({ left: windowTop.scollX, top: savedScrollY, behavior: 'auto' });
  }
  lastTarget = target;
};

const closeOnEsc = (e) => {
  if (e.keyCode === 27 && lastTarget) {
    toTarget();
  }
};

const prepTrans = (trans, plToUpper) =>
  Array.isArray(trans)
    ? trans
        .map(
          ([expr, i]) =>
            `<span class="panlexese pl${i}">${
              plToUpper ? expr.toUpperCase() : expr
            }</span>`
        )
        .join(" — ")
    : trans;

const applyTranslations = (transMap) => {
  transNodes.forEach((node) => {
      node.innerHTML = prepTrans(transMap[node.id], node.id === "stop");
      if (node.querySelector(".panlexese")) {
        panlexeseMap[node.id] = node.textContent;
      }
  });
  document.title = document.getElementById("stop").textContent;
};

const applyTooltips = (transMap) => {
  transNodes.forEach((node) => {
    const titleNode = node.tagName === "SPAN" ? node.parentNode : node;
    titleNode.setAttribute("title", prepTrans(transMap[node.id], node.id === "stop"));
  });
};

const populateTranslations = () => {
  const url = makeTranslationUrl([currUid, browserUid, fallbackUid]);
  !borked && currId && url.searchParams.append("id", currId);
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      applyTranslations(json);
    });
};

const populateTooltips = () => {
  const uids = [browserUid, fallbackUid].filter((uid) => uid !== currUid);
  if (uids.length) {
    const url = makeTranslationUrl(uids);
    return fetch(url)
      .then((r) => r.json())
      .then((json) => {
        applyTooltips(json);
      });
  } else {
    return Promise.resolve();
  }
};

const makeTranslationUrl = (uids) => {
  const url = new URL(`${backend}/`);
  uids.filter((x, i) => uids.indexOf(x) === i).forEach(
    (uid) => uid && url.searchParams.append("uid", uid)
  );
  return url;
};

const changeLang = (e) => {
  const newUrl = new URL(windowTop.location);
  newUrl.searchParams.set("uid", e.target.dataset.uid);
  newUrl.searchParams.delete("id");
  official && newUrl.searchParams.set("official", "");
  windowTop.location = newUrl;
};

const buildUrl = () => {
  if (borked && !official) {
    return Promise.reject(borkedError);
  }

  let err = null;

  const trans = Array.from(transNodes).reduce(
    (acc, node) => ({ ...acc, [node.id]: node.textContent }),
    {}
  );
  const params = new URLSearchParams();
  params.append("uid", currUid);
  for (const key in trans) {
    if (!(key in panlexeseMap && panlexeseMap[key] === trans[key])) {
      params.append(key, trans[key]);
    }
  }
  params.append("email", document.getElementById("email").value.trim());
  if (
    Object.values(trans).some((val) => val.match(/—/)) ||
    Object.values(trans).filter((val) => val.match(/\s-\s/)).length > 2
  ) {
    err = panlexeseError;
  }
  if (trans.stop === panlexeseMap.stop) {
    err = titleError;
  }

  if (official) {
    if (currLangvar.official_frozen) {
      err = frozenUidError;
    } else {
      const password = document
        .getElementById("official-pw")
        .value.trim()
        .toLowerCase();
      if (password.length === 0) {
        err = passwordEmptyError;
      } else {
        params.append("official", password);
      }
    }
  }

  return fetch(`${backend}/add`, { method: "POST", body: params })
    .then((r) => r.json())
    .then((json) => {
      const newUrl = new URL(windowTop.location);
      newUrl.searchParams.set("uid", currUid);
      !borked && json.length && newUrl.searchParams.set("id", json.map((n) => n.toString(36)).join("-"));
      return { url: newUrl, err };
    });
};

const saveTranslations = () => {
  buildUrl().then(
    (obj) => {
      if (obj.err) {
        showError(obj.err);
      } else {
        windowTop.location = obj.url;
      }
    },
    (err) => {
      if (err !== borkedError) {
        console.log(obj);
      }
    }
  );
};

const showError = (err) => {
  const errorDiv = windowTop.document.getElementById("error");
  const errorMsg = document.getElementById(err.message).cloneNode(true);
  errorMsg.style.display = "block";
  errorMsg.innerHTML = errorMsg.innerHTML.replace(/\{langname\}/g, currLangvar.name_expr_txt);
  errorDiv.replaceChild(errorMsg, errorDiv.lastElementChild);
  toTarget("error-popup");
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
  linkedin: (title, url) =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
};

const qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 500,
  height: 500,
});

qrcode.makeCode(windowTop.location.toString());

const buildAndShareURL = (e) => {
  const builder = e.currentTarget.id;
  buildUrl().then(
    (obj) => {
      shareUrl(obj.url, builder)
    },
    () => {
      shareUrl(new URL(windowTop.location), builder);
    }
  );
  e.preventDefault();
};

const shareUrl = (url, builder) => {
  url.searchParams.delete("official");
  url.searchParams.delete("edit");
  if (builder === "weixin") {
    qrcode.makeCode(url.toString());
    toTarget("qrcode-popup");
  } else {
    toTarget();
    window.open(
      shareURLBuilders[builder](
        document.getElementById("stop").textContent,
        url
      ),
      "_blank",
      "noopener"
    );
  }
};

if (navigator.maxTouchPoints && navigator.share) {
  const shareButton = document.getElementById("share-button");
  shareButton.removeAttribute("onclick");
  shareButton.addEventListener("click", () =>
    navigator.share({ url: windowTop.location.href })
  );
}

window.addEventListener("keydown", closeOnEsc);
if (window !== windowTop) {
  windowTop.addEventListener("keydown", closeOnEsc);
}

fetch(`${backend}/langvar/${currUid}`)
  .then((r) => r.json())
  .then((obj) => {
    currLangvar = obj;
    document.children[0].setAttribute("dir", currLangvar.dir);
    const langPicker = document.getElementById("lang-picker");
    langPicker.value = currLangvar.name_expr_txt;
    langPicker.addEventListener("language-select", changeLang);
    langPicker.addEventListener("focus", (e) => (e.currentTarget.value = ""));
    document
      .getElementById("lang-picker-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const firstLang = e.target.querySelector("li");
        firstLang && firstLang.click();
      });
    return populateTranslations();
  })
  .finally(() => {
    document.getElementById("poster-content").style.visibility = "visible";
    if (!official) {
      [...document.getElementsByClassName("official-only")].forEach(
        (node) => (node.style.display = "none")
      );
    }
    [...document.getElementsByClassName("app")].forEach((node) => {
      const url = new URL(windowTop.location);
      url.searchParams.delete("official");
      url.searchParams.delete("edit");
      node.href = shareURLBuilders[node.id](
        document.getElementById("stop").textContent,
        url
      );
      node.addEventListener("click", buildAndShareURL);
    });
    populateTooltips();
    if (window !== windowTop) {
      initFromFrame();
    }
  });

