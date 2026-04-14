const API_URL = "https://opensheet.elk.sh/YOUR_SHEET_ID/Data";

let fullData = [];

async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  fullData = data;

  updateDashboard(data);
  loadFilters(data);
}

function updateDashboard(data) {

  const totalBatches = data.length;

  const totalHeadcount = data.reduce((sum, r) =>
    sum + (parseInt(r["Headcount (Day 0)"]) || 0), 0);

  const totalAttrition = data.reduce((sum, r) =>
    sum + (parseInt(r["Total Attrition"]) || 0), 0);

  const avgConversion = (
    data.reduce((sum, r) =>
      sum + (parseFloat(r["Conversion(Training start to end) %"]) || 0), 0)
    / data.length
  ).toFixed(1);

  document.getElementById("batches").innerText = totalBatches;
  document.getElementById("headcount").innerText = totalHeadcount;
  document.getElementById("attrition").innerText = totalAttrition;
  document.getElementById("conversion").innerText = avgConversion + "%";

  createCharts(data);
}

function loadFilters(data) {
  const trainers = [...new Set(data.map(r => r["Trainer Name"]))];

  const dropdown = document.getElementById("trainerFilter");

  dropdown.innerHTML = `<option value="All">All Trainers</option>`;

  trainers.forEach(t => {
    dropdown.innerHTML += `<option value="${t}">${t}</option>`;
  });

  dropdown.addEventListener("change", () => {
    const val = dropdown.value;

    if (val === "All") {
      updateDashboard(fullData);
    } else {
      const filtered = fullData.filter(r => r["Trainer Name"] === val);
      updateDashboard(filtered);
    }
  });
}

function createCharts(data) {

  const trainerMap = {};

  data.forEach(r => {
    const t = r["Trainer Name"];
    const count = parseInt(r["Headcount (Day 0)"]) || 0;

    trainerMap[t] = (trainerMap[t] || 0) + count;
  });

  const labels = Object.keys(trainerMap);
  const values = Object.values(trainerMap);

  new Chart(document.getElementById("headcountChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Headcount",
        data: values
      }]
    }
  });

  new Chart(document.getElementById("attritionChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Attrition",
        data: values.map(v => v * 0.1)
      }]
    }
  });
}

loadData();
