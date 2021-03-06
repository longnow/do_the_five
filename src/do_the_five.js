import { Microphone, WebAudioPlayer } from '../webaudio/dist/src';

const backend = "https://apps.panlex.org/do_the_five-server";
const downloadUrlBase = "https://panlex.org/do_the_five-download/";
const borked = true;

const windowTop = window.top;
const transNodes = [...document.querySelectorAll("[contenteditable='true']")];
const initialSearchParams = new URLSearchParams(windowTop.location.search);
const official = initialSearchParams.get("official") !== null;

const defaultUid = "eng-000";
const fallbackUid = "eng-000";
const currUid = initialSearchParams.get("uid") || defaultUid;
const browserUid = defaultUid;
const currId = initialSearchParams.get("id") || "";
let currLangvar = {};
let offsetDir = "left";
const panlexeseMap = {};
const savedTransMap = {};
const audio = {
    blob: {},
    changed: false,
    exists: {},
    key: null,
    mic: null,
    player: null,
    playing: null,
    recording: null,
    recordMs: 10000,
    resample: true,
};

const borkedError = new Error("borked-error");
const frozenUidError = new Error("frozen-uid-error");
const passwordEmptyError = new Error("pw-empty-error");
const panlexeseError = new Error("panlexese-error");
const titleError = new Error("title-error");

let lastTarget;

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
  if (e.keyCode === 27) {
    if (lastTarget) {
      toTarget();
    }
    audio.playing && stopPlaying();
    audio.recording && stopRecording(true);
  }
};

const showError = (obj) => {
  let errorHTML = document.getElementById(obj.err.message).innerHTML;
  if (obj.err === frozenUidError) {
    errorHTML = errorHTML.replace(/\{langname\}/, escapeHTML(currLangvar.name_expr_txt));
  }
  windowTop.document.getElementById("error").innerHTML = errorHTML;
  if (obj.highlight) {
    const node = document.getElementById(obj.highlight);
    node.classList.remove("highlight-dark");
    node.classList.add("highlight-red");
    node.addEventListener("focus", (e) => { node.classList.remove("highlight-red") }, { once: true });
  }
  toTarget("error-popup");
};

const showAlert = (id) => {
  windowTop.document.getElementById("alert").innerHTML = document.getElementById(id).innerHTML;
  toTarget("alert-popup");
};

const escapeHTML = (str) => str.replace(/[&<>]/g,
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    }[tag] || tag));

const prepTransHTML = (trans, plToUpper) => {
  return Array.isArray(trans)
    ?
      trans
        .map(
          ([expr, i]) =>
            `<span class="panlexese pl${i}">${
              escapeHTML(plToUpper ? expr.toUpperCase() : expr)
            }</span>`
        )
        .join(" — ")
    :
      escapeHTML(trans);
};

const prepTransText = (trans, plToUpper) => {
  return Array.isArray(trans)
    ?
      trans
        .map(([expr, i]) => plToUpper ? expr.toUpperCase() : expr)
        .join(" — ")
    :
      trans;
};

const applyTranslations = (transMap) => {
  transNodes.forEach((node) => {
    node.innerHTML = prepTransHTML(transMap[node.id], node.id === "stop");
    if (node.id !== "language") {
      const playButton = node.parentNode.querySelector(".dt5-play");
      playButton.addEventListener("click", playTranslation(node.id));
      if (audio.exists[node.id]) {
        playButton.style.display = "unset";
      }
    }
  });
  if (!borked || official) {
    transNodes.forEach((node) => {
      savedTransMap[node.id] = node.textContent;
      if (Array.isArray(transMap[node.id])) {
        panlexeseMap[node.id] = node.textContent;
        node.classList.add("highlight-dark");
        node.addEventListener("input", (e) => { node.classList.remove("highlight-dark") }, { once: true });
      }
    });
    if (!currLangvar.audio_frozen) {
      transNodes.forEach((node) => {
        if (node.id !== "language") {
          const recordIcon = document.createElement("i");
          recordIcon.className = "fas fa-microphone";
          recordIcon.addEventListener("click", showRecordPopup(node.id));
          node.parentNode.querySelector(".audio-buttons").appendChild(recordIcon);
        }
      });
    }
    windowTop.onbeforeunload = (e) => {
      if (unsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
  }
  document.title = document.getElementById("stop").textContent;
};

const applyTooltips = (transMap) => {
  transNodes.forEach((node) => {
    node.parentNode.setAttribute("title", prepTransText(transMap[node.id], node.id === "stop"));
  });
};

const populateTranslations = () => {
  const url = makeTranslationUrl([currUid, browserUid, fallbackUid]);
  currId && url.searchParams.append("id", currId);
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      audio.exists = json.audio;
      delete json.audio;
      applyTranslations(json);
    });
};

const populateTooltips = () => {
  if (browserUid !== currUid) {
    const url = makeTranslationUrl([browserUid, fallbackUid]);
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

  const obj = { err: null, highlight: null };
  const trans = Array.from(transNodes).reduce(
    (acc, node) => ({ ...acc, [node.id]: node.textContent }),
    {}
  );
  const params = new FormData();
  params.set("uid", currUid);
  for (const key in trans) {
    if (!(key in panlexeseMap && panlexeseMap[key] === trans[key])) {
      params.set(key, trans[key]);
    }
  }
  params.set("email", document.getElementById("email-input").value.trim());
  params.set("name", document.getElementById("name-input").value.trim());
  if (trans.stop === panlexeseMap.stop) {
    obj.err = titleError;
    obj.highlight = "stop";
  }
  if (Object.keys(trans).some(
    (key) => trans[key].match(/—| - /) && !(key === "stop" && trans.stop === panlexeseMap.stop)
  )) {
    obj.err = panlexeseError;
    obj.highlight = null;
  }

  if (official) {
    if (currLangvar.official_frozen && unsavedChangesText()) {
      obj.err = frozenUidError;
    } else {
      const password = document
        .getElementById("official-pw")
        .value.trim()
        .toLowerCase();
      if (password.length) {
        params.set("official", password);
        Object.keys(audio.blob).forEach((key) => {
          params.set(`audio-${key}`, audio.blob[key]);
        });
      } else if (!obj.err) {
        obj.err = passwordEmptyError;
        obj.highlight = "official-pw";
      }
    }
  }

  return fetch(`${backend}/add`, { method: "POST", body: params })
    .then((r) => r.json())
    .then((json) => {
      obj.url = new URL(windowTop.location);
      obj.url.searchParams.set("uid", currUid);
      !borked && json.length && obj.url.searchParams.set("id", json.map((n) => n.toString(36)).join("-"));
      audio.changed = false;
      transNodes.forEach((node) => {
        savedTransMap[node.id] = node.textContent;
      });
      return obj;
    });
};

const buildUrlPermissive = () => {
  return new Promise((resolve, reject) => {
    buildUrl().then(
      (obj) => {
        resolve(obj.url)
      },
      () => {
        const url = new URL(windowTop.location);
        if (!url.searchParams.has("uid")) {
          url.searchParams.set("uid", currUid);
        }
        resolve(url);
      }
    );
  });
};

const makeUrlShareable = (url) => {
  url.searchParams.delete("official");
  url.searchParams.delete("edit");
};

const saveTranslations = () => {
  buildUrl().then(
    (obj) => {
      if (obj.err) {
        showError(obj);
      } else {
        obj.url.searchParams.set("success", 1);
        windowTop.location = obj.url;
      }
    },
    (err) => {
      if (err !== borkedError) {
        console.log(err);
      }
    }
  );
};

const unsavedChanges = () => {
  return audio.changed || unsavedChangesText();
};
const unsavedChangesText = () => {
  return transNodes.some((node) => savedTransMap[node.id] !== node.textContent);
};

const shareUrlBuilders = {
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

const buildAndShareUrl = (e) => {
  const builder = e.currentTarget.id;
  buildUrlPermissive().then((url) => {
    makeUrlShareable(url);
    shareUrl(url, builder);
  });
  e.preventDefault();
};

const shareUrl = (url, builder) => {
  if (builder === "weixin") {
    qrcode.makeCode(url.toString());
    toTarget("qrcode-popup");
  } else {
    toTarget();
    window.open(
      shareUrlBuilders[builder](
        document.getElementById("stop").textContent,
        url
      ),
      "_blank",
      "noopener"
    );
  }
};

const downloadFile = (type) => {
  buildUrlPermissive().then((url) => {
    makeUrlShareable(url);
    const downloadUrl = new URL(downloadUrlBase);
    downloadUrl.search = url.search;
    downloadUrl.searchParams.set("type", type);
    window.open(downloadUrl, "_blank", "noopener");
  });
};

let frame;
let currOffset = 0;
const initialRect = document.getElementById("poster").getBoundingClientRect();
document.getElementById("container").style.maxWidth = initialRect.width + 'px';
const resize = () => {
  const vw = windowTop.document.documentElement.clientWidth;
  const scale = Math.min(1, (0.95 * vw) / initialRect.width);
  const container = document.getElementById("container");
  container.style.transform = scale < 1 ? `scale(${scale})` : null;
  container.style[offsetDir] = ((vw - document.getElementById("poster").getBoundingClientRect().width) / 2) + 'px';
  let newHeight = initialRect.height * scale;
  if (frame) {
    newHeight += 60;
    container.style.height = newHeight + 'px';
    frame.style.height = (newHeight + 40) + 'px';
    let newOffset = frame.getBoundingClientRect()[offsetDir];
    if (offsetDir === "right") {
      newOffset -= vw;
    }
    if (newOffset !== 0) {
      currOffset -= newOffset;
      frame.style.left = currOffset + 'px';
    }
  } else {
    container.style.height = newHeight + 'px';
  }
};

const playTranslation = (key) => {
  return (e) => {
    let shouldPlay = true;
    if (audio.playing) {
      if (audio.playing.key === key) {
        shouldPlay = false;
      }
      stopPlaying();
    }
    if (shouldPlay) {
      loadPlayerAudio(key).then(() => {
        startPlaying(key, e.target, "fa-volume-up", "fa-stop-circle");
      });
    }
  };
};

const loadPlayerAudio = (key) => {
  if (!audio.player) {
    audio.player = new WebAudioPlayer();
  }
  return audio.blob[key]
    ? audio.player.loadFromBlob(audio.blob[key])
    : audio.player.load(`${backend}/audio/${currUid}_${key}.mp3?${audio.exists[key]}`);
};

const startPlaying = (key, node, stoppedClass, playingClass) => {
  node.classList.remove(stoppedClass);
  node.classList.add(playingClass);
  audio.playing = { key, node, stoppedClass, playingClass };
  audio.player.play();
  audio.player.observeProgress().subscribe((ms) => {
    if (ms === -1 && audio.playing) {
      stopPlaying();
    }
  });
};

const stopPlaying = () => {
  audio.playing.node.classList.remove(audio.playing.playingClass);
  audio.playing.node.classList.add(audio.playing.stoppedClass);
  audio.playing = null;
  audio.player.pause();
};

const showRecordPopup = (key) => {
  return () => {
    audio.key = key;
    const text = windowTop.document.getElementById("dt5-record-text");
    text.setAttribute("dir", currLangvar.dir);
    text.textContent = document.getElementById(key).textContent;
    setPlayInPopupState(audio.exists[key]);
    toTarget("record-popup");
  };
};

const setPlayInPopupState = (enabled) => {
  const classList = windowTop.document.getElementById("dt5-play").classList;
  if (enabled) {
    classList.remove("fa-disabled");
  } else {
    classList.add("fa-disabled");
  }
};

const recordInPopup = (e) => {
  if (audio.recording) {
    stopRecording(true);
  } else {
    audio.playing && stopPlaying();
    audio.mic = new Microphone(audio.resample ? {resampleRate: 16000} : {resample: false});
    const progress = windowTop.document.getElementById("dt5-progress");
    progress.value = 0;
    audio.mic.observeProgress().subscribe((ms) => {
      progress.value = ms / audio.recordMs;
    });
    Promise.all([audio.mic.connect(),audio.mic.onready]).then(() => {
      if (audio.mic.canRecord()) {
        startRecording(e.target, "fa-dot-circle", "fa-stop-circle");
        progress.style.visibility = "unset";
        if (audio.timeout) {
          clearTimeout(audio.timeout);
        }
        audio.timeout = setTimeout(() => {
          if (audio.recording) stopRecording(false);
        }, audio.recordMs);
      }
    });
  }
};

const startRecording = (node, stoppedClass, recordingClass) => {
  setPlayInPopupState(false);
  audio.recording = { node, stoppedClass, recordingClass };
  audio.mic.record();
  node.classList.remove(stoppedClass);
  node.classList.add(recordingClass);
};

const stopRecording = (strip) => {
  if (audio.timeout) {
    clearTimeout(audio.timeout);
  }
  audio.recording.node.classList.remove(audio.recording.recordingClass);
  audio.recording.node.classList.add(audio.recording.stoppedClass);
  windowTop.document.getElementById("dt5-progress").style.visibility = "hidden";
  audio.recording = null;
  audio.mic.stop().then(() => {
    setPlayInPopupState(true);
    document.getElementById(audio.key).parentNode.querySelector(".dt5-play").style.display = "unset";
    if (strip) {
      audio.mic.stripMs(500);
    }
    audio.blob[audio.key] = audio.mic.exportAllWav();
    audio.changed = audio.exists[audio.key] = true;
    audio.mic.destroy();
    audio.mic = null;
  });
};

const playInPopup = (e) => {
  const progress = windowTop.document.getElementById("dt5-progress");
  if (audio.playing) {
    stopPlaying();
    progress.style.visibility = "hidden";
  } else if (audio.exists[audio.key]) {
    loadPlayerAudio(audio.key).then(() => {
      progress.value = 0;
      audio.player.observeProgress().subscribe((ms) => {
        if (ms === -1) {
          progress.style.visibility = "hidden";
        } else {
          progress.value = ms / audio.player.duration;
        }
      });
      startPlaying(audio.key, e.target, "fa-play-circle", "fa-stop-circle");
      progress.style.visibility = "unset";
    });
  }
};

const init = () => {
  if (window !== windowTop) {
    initFromFrame();
  }

  window.addEventListener("keydown", closeOnEsc);
  windowTop.addEventListener("resize", resize);
  resize();
  populateTooltips();

  [...windowTop.document.getElementsByClassName("app")].forEach((node) => {
    const url = new URL(windowTop.location);
    makeUrlShareable(url);
    node.href = shareUrlBuilders[node.id](
      document.getElementById("stop").textContent,
      url
    );
    node.addEventListener("click", buildAndShareUrl);
  });
  if (navigator.maxTouchPoints && navigator.share) {
    const shareButton = document.getElementById("share-button");
    shareButton.removeAttribute("onclick");
    shareButton.addEventListener("click", () =>
      navigator.share({ url: windowTop.location.href })
    );
  }
  if (initialSearchParams.has("print")) {
    document.documentElement.classList.add("fullsize");
  }
  if (initialSearchParams.has("png")) {
    document.documentElement.classList.add("png");
  }

  if (!official) {
    [...document.getElementsByClassName("official-only")].forEach((node) => {
      node.style.display = "none";
    });
  }
  if (borked && !official) {
    transNodes.forEach((node) => {
      node.contentEditable = false;
    });
    document.getElementById("bottom-form").style.display = "none";
  } else {
    transNodes.forEach((node) => {
      node.addEventListener("paste", (e) => {
        window.setTimeout(() => { // after paste is done
          const sel = window.getSelection();
          if (!sel.isCollapsed) sel.collapseToEnd();

          let elt = sel.focusNode;
          let offset = elt.nodeType === 1 && !elt.textContent.length
            ? 0 // odd firefox case with trailing newline
            : sel.focusOffset;
          while (elt.contentEditable !== "true") {
            let prevElt = elt.previousSibling;
            while (prevElt) {
              offset += prevElt.textContent.length;
              prevElt = prevElt.previousSibling;
            }
            elt = elt.parentNode;
          }

          node.textContent = node.textContent.replace(/\u00A0/g, " "); // reset to plain
          if (offset > node.textContent.length) offset = node.textContent.length;
          const range = document.createRange();
          range.setStart(node.firstChild, offset);
          range.setEnd(node.firstChild, offset);
          sel.removeAllRanges();
          sel.addRange(range);
        }, 0);
      });
    });

    windowTop.document.getElementById("dt5-record").addEventListener("click", recordInPopup);
    windowTop.document.getElementById("dt5-play").addEventListener("click", playInPopup);
  }

  if (currLangvar.dir === "rtl") { // inset-* properties not well supported yet, ugh
    [...document.styleSheets].some(sheet => {
      if (sheet.href.match(/\/styles\.css/)) {
        [...sheet.rules]
        .filter(rule => rule.type === CSSRule.STYLE_RULE &&
          (rule.selectorText === "#do_the_five #search-icon" || rule.selectorText === "#do_the_five .audio-buttons"))
        .forEach(rule => {
          rule.style.setProperty("left", rule.style.getPropertyValue("right"));
          rule.style.removeProperty("right");
        })
        return true;
      }
      return false;
    });
  }

  // Safari fixes
  if (window.webkitAudioContext) {
    audio.resample = false;
    window.AudioContext = window.webkitAudioContext;
    const dad = window.AudioContext.prototype.decodeAudioData;
    window.AudioContext.prototype.decodeAudioData = function decodeAudioData(buffer) {
      return new Promise((resolve, reject) => {
        dad.call(this, buffer, resolve, reject);
      });
    }
  }
};

const initFromFrame = () => {
  frame = windowTop.document.querySelector("iframe");
  windowTop.dt5 = window.dt5;
  windowTop.addEventListener("keydown", closeOnEsc);
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
  const viewport = windowTop.document.querySelector("meta[name='viewport']");
  if (viewport && viewport.getAttribute("content").match(/maximum-scale/)) {
    viewport.replaceWith(document.querySelector("meta[name='viewport']").cloneNode());
  }
};

fetch(`${backend}/langvar/${currUid}`)
  .then((r) => r.json())
  .then((obj) => {
    currLangvar = obj;
    document.documentElement.setAttribute("lang", `und-${currLangvar.script_expr_txt}`);
    document.documentElement.setAttribute("dir", currLangvar.dir);
    if (currLangvar.dir === "rtl") {
      offsetDir = "right";
    }
    const langPicker = document.getElementById("lang-picker");
    langPicker.value = currLangvar.name_expr_txt;
    langPicker.addEventListener("language-select", changeLang);
    langPicker.addEventListener("focus", (e) => {
      e.currentTarget.value = "";
    });
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
    init();
    document.body.style.visibility = "visible";
    if (initialSearchParams.has("success")) {
      const url = new URL(windowTop.location);
      url.searchParams.delete("success");
      windowTop.history.replaceState(null, "", url);
      setTimeout(() => showAlert("success-alert"), 200);
    }
  });

  export { downloadFile, playInPopup, recordInPopup, saveTranslations, toTarget };
