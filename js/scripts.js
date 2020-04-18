const backend = "https://apps.panlex.org/do_the_five-server";
const borked = true;
let frozen = false;

const windowTop = window === window.top ? window : window.parent;
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

const uniqify = (ary) => {
  return ary.filter((x, i) => ary.indexOf(x) === i);
};

const toTarget = (target) => {
  const saveScrollY = windowTop.scrollY;
  const url = new URL(window.location);
  url.hash = target;
  window.location.replace(url);
  url.hash = "";
  window.history.replaceState(null, "", url);
  if (windowTop.scrollY !== saveScrollY) {
    windowTop.scroll({ left: windowTop.scollX, top: saveScrollY, behavior: 'auto' });
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
  transNodes.forEach(
    (node) =>
      (node.innerHTML = prepTrans(transMap[node.id], node.id === "stop"))
  );
  document.title = document.getElementById("stop").textContent;
};

const populateTranslations = () => {
  const url = new URL(`${backend}/`);
  uniqify([currUid, browserUid, fallbackUid]).forEach(
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
  const newUrl = new URL(windowTop.location);
  newUrl.searchParams.set("uid", e.target.dataset.uid);
  newUrl.searchParams.delete("id");
  official && newUrl.searchParams.set("official", "");
  windowTop.location = newUrl;
};

const frozenUidError = new Error("frozenUid");
const pwEmptyError = new Error("pwEmpty");

const buildUrl = () => {
  if (frozen) return Promise.reject(frozenUidError);
  const trans = Array.from(transNodes).reduce(
    (acc, node) => ({ ...acc, [node.id]: node.textContent }),
    {}
  );
  const params = new URLSearchParams();
  params.append("uid", currUid);
  for (const key in trans) {
    params.append(key, trans[key]);
  }
  params.append("email", document.getElementById("email").value.trim());
  let pwEmpty = false;
  if (official) {
    const pw = document
      .getElementById("official-pw")
      .value.trim()
      .toLowerCase();
    if (pw.length === 0) {
      pwEmpty = true;
    } else {
      params.append("official", pw);
    }
  }

  const add = fetch(`${backend}/add`, { method: "POST", body: params });
  if (pwEmpty) {
    add.then();
    return Promise.reject(pwEmptyError);
  } else {
    return add
      .then((r) => r.json())
      .then((json) => {
        const newId = json.map((n) => n.toString(36)).join("-");
        const newUrl = new URL(windowTop.location);
        newUrl.searchParams.set("uid", currUid);
        !borked && newUrl.searchParams.set("id", newId);
        return newUrl;
      });
  }
};

const saveTranslations = () => {
  buildUrl().then(
    (newUrl) => (windowTop.location = newUrl),
    (reason) => {
      if (reason === frozenUidError) {
        showError("frozen-uid-error");
      } else if (reason === pwEmptyError) {
        showError("pw-empty-error");
      } else {
        console.log(reason);
      }
    }
  );
};

const showError = (err) => {
  document.querySelectorAll(".error").forEach((elt) => {
    elt.style.visibility = elt.id === err ? "visible" : "hidden";
  });
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

const changeShareURL = (e) => {
  const node = e.currentTarget;
  buildUrl().then(
    (newUrl) => {
      newUrl.searchParams.delete("official");
      if (node.id == "weixin") {
        qrcode.makeCode(newUrl.toString());
        toTarget("qrcode-popup");
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
      newUrl = new URL(windowTop.location);
      newUrl.searchParams.delete("official");
      if (node.id == "weixin") {
        qrcode.makeCode(newUrl.toString());
        toTarget("qrcode-popup");
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

if (navigator.maxTouchPoints && navigator.share) {
  const shareButton = document.getElementById("share-button");
  shareButton.removeAttribute("onclick");
  shareButton.addEventListener("click", () =>
    navigator.share({ url: windowTop.location.href })
  );
}

if (window !== windowTop) {
  windowTop.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      window.print();
    }
  });
}

fetch(`${backend}/langvar/${currUid}`)
  .then((r) => r.json())
  .then((langvar) => {
    frozen = langvar.official_frozen;
    document.children[0].setAttribute("dir", langvar.dir);
    document.getElementById("lang-picker").value = langvar.name_expr_txt;
    document
      .getElementById("lang-picker")
      .addEventListener("language-select", changeLang);
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
      const newUrl = new URL(windowTop.location);
      newUrl.searchParams.delete("official");
      node.href = shareURLBuilders[node.id](
        document.getElementById("stop").textContent,
        newUrl
      );
      node.addEventListener("click", changeShareURL);
    });
  });
