const baseQuests = [
  { name: "Pompes", base: 10, scale: 5, xp: 30 },
  { name: "Squats", base: 20, scale: 5, xp: 30 },
  { name: "Planche (sec)", base: 30, scale: 10, xp: 40 }
];

let data = JSON.parse(localStorage.getItem("save")) || {
  level: 1,
  xp: 0,
  streak: 0,
  theme: "green",
  customQuests: [],
  lastDate: "",
  dailyQuests: []
};

const today = new Date().toISOString().slice(0, 10);

// --- Génération quotidienne ---
function generateDailyQuests() {
  const pool = [
    ...baseQuests.map(q => {
      const scale = Math.max(1, Math.floor(data.level / 2));
      return {
        name: `${q.base + scale * q.scale} ${q.name}`,
        xp: q.xp + scale * 5
      };
    }),
    ...data.customQuests.map(q => ({ name: q, xp: 50 }))
  ];

  return pool.sort(() => 0.5 - Math.random()).slice(0, 3).map((q, i) => ({
    id: i,
    ...q,
    done: false
  }));
}

// --- Reset journalier ---
if (data.lastDate !== today) {
  if (data.dailyQuests.length && data.dailyQuests.every(q => q.done)) {
    data.streak++;
  } else if (data.dailyQuests.length) {
    data.streak = 0;
    data.xp = Math.max(0, data.xp - 50);
  }

  data.dailyQuests = generateDailyQuests();
  data.lastDate = today;
}

// --- Sauvegarde ---
function save() {
  localStorage.setItem("save", JSON.stringify(data));
}

// --- Thème ---
function getButtonClass() {
  return data.theme === "green" ? "green-btn" : "blue-btn";
}

function toggleTheme() {
  data.theme = data.theme === "green" ? "blue" : "green";
  applyTheme();
  save();
}

function applyTheme() {
  const color = data.theme === "green" ? "#22c55e" : "#3b82f6";

  document.body.style.color = color;
  document.getElementById("xpFill").style.background = color;

  // boutons
  document.getElementById("themeBtn").className = getButtonClass();
  document.getElementById("addBtn").className = getButtonClass();

  // logo
  document.getElementById("logo").src =
    data.theme === "green" ? "logo-green.png" : "logo-blue.png";

   updateAllButtons();
}

// --- XP ---
function gainXP(amount) {
  data.xp += amount;
  const max = data.level * 100;

  if (data.xp >= max) {
    data.xp -= max;
    data.level++;
    alert("LEVEL UP !");
  }
}

// --- Quêtes ---
function renderQuests() {
  const container = document.getElementById("quests");
  container.innerHTML = "";

  data.dailyQuests.forEach(q => {
    const div = document.createElement("div");
    div.className = "card";

    const btn = document.createElement("button");
    btn.innerText = q.done ? "✔ DONE" : "Valider";
    btn.classList.add(getButtonClass());

    btn.onclick = () => {
      if (!q.done) {
        q.done = true;
        gainXP(q.xp);
        save();
        render();
      }
    };

    div.innerHTML = `<p>${q.name} (+${q.xp} XP)</p>`;
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function updateAllButtons() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.classList.remove("green-btn", "blue-btn");
    btn.classList.add(getButtonClass());
  });
}

// --- Timer ---
function updateTimer() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight - now;

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  document.getElementById("timer").innerText =
    `Reset dans : ${h}h ${m}m ${s}s`;
}

// --- HUD ---
function renderHUD() {
  document.getElementById("hud").innerText =
    `Lv ${data.level} | XP ${data.xp} | Streak ${data.streak}`;

  const percent = (data.xp / (data.level * 100)) * 100;
  document.getElementById("xpFill").style.width = percent + "%";
}

// --- Custom ---
function addCustomQuest() {
  const input = document.getElementById("newQuest");
  if (input.value) {
    data.customQuests.push(input.value);
    input.value = "";
    save();
  }
}

// --- Render ---
function render() {
  applyTheme();
  renderHUD();
  renderQuests();
}

setInterval(updateTimer, 1000);

render();
save();
