// ====== 27 FOTOS: 01.jpg fins 27.jpg (no has d'escriure-les una a una) ======
const imgs = Array.from({length: 27}, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { src: `img/${n}.jpg`, name: `${n}.jpg` };
});

// ====== ELEMENTS ======
const enterBtn = document.getElementById("enterBtn");
const baitZone = document.getElementById("baitZone");
const baitWall = document.getElementById("baitWall");
const pixelGrid = document.getElementById("pixelGrid");

const viewer = document.getElementById("viewer");
const bigImg = document.getElementById("bigImg");
const currentNameEl = document.getElementById("currentName");
const statusEl = document.getElementById("status");

const nextBtn = document.getElementById("nextBtn");
const moveBtn = document.getElementById("moveBtn");
const loadBtn = document.getElementById("loadBtn");
const dlBtn = document.getElementById("dlBtn");

const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const cancelFake = document.getElementById("cancelFake");

const progressWrap = document.getElementById("progressWrap");
const progressBar = document.getElementById("progressBar");
const progressPct = document.getElementById("progressPct");
const progressLabel = document.getElementById("progressLabel");
const progressNote = document.getElementById("progressNote");

const voidMsg = document.getElementById("voidMsg");

// ====== ESTAT ======
let currentName = null;
let lastIndex = -1;
let dotsTimer = null;

function setStatus(msg){ statusEl.textContent = msg; }

// ====== ENTRADA -> ZONA BAIT ======
enterBtn.addEventListener("click", () => {
  baitZone.hidden = false;

  // paret de BAIT
  baitWall.innerHTML = "";
  const total = 16;
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "baitBlock" + (i % 5 === 0 ? " big" : "");
    d.textContent = "BAIT";
    baitWall.appendChild(d);
  }

  buildPixelGallery();
  baitZone.scrollIntoView({behavior:"smooth", block:"start"});

  // opcional: ja et posa una foto “assignada”
  showRandomImage();
});

// ====== GALERIA PIXELADA ======
function buildPixelGallery(){
  pixelGrid.innerHTML = "";
  imgs.forEach((it) => {
    const btn = document.createElement("button");
    btn.className = "thumb pixelWrap";
    btn.innerHTML = `
      <img class="pixelImg" src="${it.src}" alt="preview">
      <span class="pixelTag">clica aquí per veure</span>
    `;
    btn.addEventListener("click", () => openImage(it));
    pixelGrid.appendChild(btn);
  });
}

// ====== OBRIR IMATGE ======
function openImage(it){
  currentName = it.name;

  viewer.hidden = false;
  bigImg.src = it.src;
  currentNameEl.textContent = currentName;

  // reset trampes
  setStatus("Verificant permisos…");
  loader.hidden = true;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = null;

  progressWrap.hidden = true;
  progressBar.style.width = "0%";
  progressPct.textContent = "0%";
  progressNote.textContent = "—";

  setTimeout(() => setStatus("Accés concedit (parcial)."), 600);
  viewer.scrollIntoView({behavior:"smooth", block:"start"});
}

// ====== FOTO ALEATÒRIA DIFERENT ======
function showRandomImage(){
  if (!imgs.length) return;

  let idx = Math.floor(Math.random() * imgs.length);
  if (imgs.length > 1) {
    while (idx === lastIndex) idx = Math.floor(Math.random() * imgs.length);
  }
  lastIndex = idx;
  openImage(imgs[idx]);
}

nextBtn.addEventListener("click", () => showRandomImage());

// ====== BOTÓ QUE ES MOU ======
moveBtn.addEventListener("click", () => {
  const parent = moveBtn.parentElement;
  const maxX = Math.max(0, parent.clientWidth - moveBtn.offsetWidth);
  const maxY = 120;

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  moveBtn.style.position = "relative";
  moveBtn.style.left = x + "px";
  moveBtn.style.top = y + "px";

  const msgs = ["Ups.", "Gairebé.", "No era aquí.", "Segueix intentant-ho."];
  setStatus(msgs[Math.floor(Math.random() * msgs.length)]);
});

// ====== LOADING INFINIT ======
loadBtn.addEventListener("click", () => {
  loader.hidden = false;
  setStatus("Carregant contingut… (això pot trigar)");

  let dots = 0;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    loaderText.textContent = "Carregant" + ".".repeat(dots);
  }, 450);
});

cancelFake.addEventListener("click", () => {
  loader.hidden = true;
  if (dotsTimer) clearInterval(dotsTimer);
  dotsTimer = null;
  setStatus("Cancel·lat. Però no s’ha resolt res.");
});

// ====== DESCÀRREGA FAKE 99% ======
dlBtn.addEventListener("click", () => {
  if (!currentName) {
    setStatus("Primer obre una imatge.");
    return;
  }

  progressWrap.hidden = false;
  progressLabel.textContent = `Descarregant ${currentName}…`;
  progressNote.textContent = "Preparant fitxer…";
  setStatus("");

  let p = 0;
  progressBar.style.width = "0%";
  progressPct.textContent = "0%";

  const interval = setInterval(() => {
    if (p < 90) p += 10;
    else if (p < 99) p += 1;
    else p = 99;

    progressBar.style.width = p + "%";
    progressPct.textContent = p + "%";

    if (p === 99) {
      progressNote.textContent = "Quasi. Però no.";
      setStatus("La descàrrega s’ha quedat a 99% per sempre.");
      clearInterval(interval);
    }
  }, 200);
});

// ====== SCROLL INFINIT BUIT ======
window.addEventListener("scroll", () => {
  const y = window.scrollY || document.documentElement.scrollTop;

  if (y > 300 && y % 420 < 12) {
    const msgs = [
      "Encara més avall.",
      "Ja quasi hi ets.",
      "La resposta és a sota",
      "Un últim esforç",
      "venga segueix!"
    ];
    voidMsg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
  }

  const nearBottom = window.innerHeight + y >= document.body.offsetHeight - 60;
  if (nearBottom) {
    const spacer = document.createElement("div");
    spacer.style.height = "55vh";
    document.body.appendChild(spacer);
  }
});
