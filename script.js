const subjects = ["Maths/Hindi", "Physics", "Chemistry", "English", "CS/Bio", "Yoga"];
const container = document.getElementById("subjects");
const dateSelect = document.getElementById("dateSelect");

let studyData = JSON.parse(localStorage.getItem("studyData")) || {};
let running = null;

// helper
function formatDate(d) {
  return d.toISOString().split("T")[0];
}

function formatTime(sec) {
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  let s = sec % 60;
  return `${h} hr ${m} min ${s} sec`;
}

// create dates from today to 25 March
const today = new Date();
const endDate = new Date(today.getFullYear(), 2, 25); // March = 2
let dates = [];

for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
  dates.push(formatDate(new Date(d)));
}

// init data + dropdown
dates.forEach(date => {
  if (!studyData[date]) {
    studyData[date] = {};
    subjects.forEach(s => studyData[date][s] = 0);
  }
  const opt = document.createElement("option");
  opt.value = date;
  opt.textContent = date;
  dateSelect.appendChild(opt);
});

dateSelect.value = formatDate(today);

// calculate overall total
function calculateOverall() {
  let total = 0;
  for (let date in studyData) {
    subjects.forEach(sub => {
      total += studyData[date][sub] || 0;
    });
  }
  if (running) {
    total += Math.floor((Date.now() - running.start) / 1000);
  }
  return total;
}

function updateUI() {
  const date = dateSelect.value;
  container.innerHTML = "";
  let dayTotal = 0;

  subjects.forEach(sub => {
    let time = studyData[date][sub];

    if (running && running.date === date && running.subject === sub) {
      time += Math.floor((Date.now() - running.start) / 1000);
    }

    dayTotal += time;

    const div = document.createElement("div");
    div.className = "subject";
    div.innerHTML = `
      <h3>${sub}</h3>
      <div class="time">${formatTime(time)}</div>
      <button>
        ${running && running.subject === sub && running.date === date ? "Stop" : "Start"}
      </button>
    `;

    div.querySelector("button").onclick = () => toggle(sub);
    container.appendChild(div);
  });

  document.getElementById("grandTotal").innerText = formatTime(dayTotal);
  document.getElementById("overallTotal").innerText = formatTime(calculateOverall());
}

function toggle(sub) {
  const date = dateSelect.value;

  if (running) {
    const elapsed = Math.floor((Date.now() - running.start) / 1000);
    studyData[running.date][running.subject] += elapsed;
    running = null;
  } else {
    running = {
      subject: sub,
      date: date,
      start: Date.now()
    };
  }

  localStorage.setItem("studyData", JSON.stringify(studyData));
  updateUI();
}

dateSelect.onchange = () => {
  if (running) toggle(running.subject);
  updateUI();
};

setInterval(updateUI, 1000);
updateUI();
