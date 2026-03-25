let level = 1;
let xp = 0;
let streak = 0;
let theme = "green";
let customQuests = JSON.parse(localStorage.getItem("quests")) || [];

function save() {
  localStorage.setItem("quests", JSON.stringify(customQuests));
}

function toggleTheme() {
  theme = theme === "green" ? "blue" : "green";
  document.body.style.color = theme === "green" ? "#22c55e" : "#3b82f6";
}

function generateQuests() {
  const base = [
    "10 Pompes",
    "20 Squats",
    "30s Planche"
  ];

  const pool = [...base, ...customQuests];

  return pool.sort(() => 0.5 - Math.random()).slice(0, 3);
}

function render() {
  const quests = generateQuests();
  const container = document.getElementById("quests");
  container.innerHTML = "";

  quests.forEach(q => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p>${q}</p>
      <button onclick="gainXP()">Valider</button>
    `;

    container.appendChild(div);
  });

  document.getElementById("hud").innerText =
    `Lv ${level} | XP ${xp} | Streak ${streak}`;
}

function gainXP() {
  xp += 20;
  if (xp >= level * 100) {
    xp = 0;
    level++;
    alert("LEVEL UP");
  }
  render();
}

function addQuest() {
  const input = document.getElementById("newQuest");
  if (input.value) {
    customQuests.push(input.value);
    save();
    input.value = "";
    render();
  }
}

render();