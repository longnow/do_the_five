let transInfo;

const lightenDarkenColor = (col, amt) => {
  var usePound = false;

  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
};

const changeSkin = e => {
  let skin = e.target.value;
  let skinDark = lightenDarkenColor(skin, -30);
  let skinVeryDark = lightenDarkenColor(skin, -30);
  Array.from(document.getElementsByClassName("skin")).forEach(node => {
    node.style.fill = skin;
    node.style.stroke = skinDark;
  });
  Array.from(document.getElementsByClassName("skin-dark")).forEach(node => {
    node.style.fill = skinDark;
    node.style.stroke = skinVeryDark;
  });
};

const transStrings = {
  wash: ["wash", "hand"],
  cough: ["cough", "elbow"],
  face: ["no", "touch", "face"],
  distance: ["distance"],
  home: ["stay", "home"]
};

const changeLang = e => {
  let lang = e.target.dataset.uid;
  Object.keys(transStrings).forEach(fig => {
    let strings = transStrings[fig].map(string => transInfo[lang][string]);
    document.getElementById(fig).innerHTML = strings.join(" — ");
  });
};

document
  .getElementsByName("skin")
  .forEach(node => node.addEventListener("change", changeSkin));

fetch("result.json")
  .then(r => r.json())
  .then(json => {
    transInfo = json;
  })
  .then(() => {
    document.getElementsByName("lang").forEach(node => {
      node.addEventListener("change", changeLang);
      node.nextElementSibling.innerHTML = transInfo[node.value].autoglossonym;
    });
  });

document
  .getElementById("lang-picker")
  .addEventListener("language-select", changeLang);
