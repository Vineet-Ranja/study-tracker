const subjects = ["Maths/Hindi", "Physics", "Chemistry", "English", "CS/Bio", "Yoga"];
const container = document.getElementById("subjects");

let data = JSON.parse(localStorage.getItem("studyData")) || {};

subjects.forEach(sub => {
  if (!data[sub]) {
    data[sub] = { total: 0, running: false, start: null };
  }
});

function formatTime(sec) {
  let h = Math.floor(sec / 3600);
  let m = Math.floor((sec % 3600) / 60);
  let s = sec % 60;
  return `${h} hr ${m} min ${s} sec`;
}

function updateUI() {
  container.innerHTML = "";
  let grandTotal = 0;

  subjects.forEach(sub => {
    let subj = data[sub];
    let currentTime = subj.total;

    if (subj.running) {
      currentTime += Math.floor((Date.now() - subj.start) / 1000);
    }

    grandTotal += currentTime;

    const div = document.createElement("div");
    div.className = "subject";

    div.innerHTML = `
      <h3>${sub}</h3>
      <div class="time">${formatTime(currentTime)}</div>
      <button onclick="toggle('${sub}')">
        ${subj.running ? "Stop" : "Start"}
      </button>
    `;

    container.appendChild(div);
  });

  document.getElementById("grandTotal").innerText = formatTime(grandTotal);
}

function toggle(sub) {
  let subj = data[sub];

  if (!subj.running) {
    subj.running = true;
    subj.start = Date.now();
  } else {
    subj.running = false;
    subj.total += Math.floor((Date.now() - subj.start) / 1000);
    subj.start = null;
  }

  localStorage.setItem("studyData", JSON.stringify(data));
  updateUI();
}

setInterval(updateUI, 1000);
updateUI();

