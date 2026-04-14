const API_URL = "https://opensheet.elk.sh/1DFsrdpwH5XSdNcmyXCqKE-FRFSMXQKxRj2d0Fx8S8fg/Data";

let originalData = [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    originalData = data;

    initFilters(data);
    renderDashboard(data);
  });

function initFilters(data) {

  createDropdown("monthFilter", data, "Month");
  createDropdown("trainerFilter", data, "Trainer Name");
  createDropdown("processFilter", data, "Process");
  createDropdown("batchFilter", data, "Batches");

  document.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", applyFilters);
  });
}

function createDropdown(id, data, key) {
  const values = [...new Set(data.map(d => d[key]))];
  const select = document.getElementById(id);

  select.innerHTML = `<option value="">All ${key}</option>` +
    values.map(v => `<option>${v}</option>`).join("");
}

function applyFilters() {
  let filtered = originalData;

  const month = document.getElementById("monthFilter").value;
  const trainer = document.getElementById("trainerFilter").value;
  const process = document.getElementById("processFilter").value;
  const batch = document.getElementById("batchFilter").value;

  filtered = filtered.filter(item =>
    (!month || item["Month"] === month) &&
    (!trainer || item["Trainer Name"] === trainer) &&
    (!process || item["Process"] === process) &&
    (!batch || item["Batches"] === batch)
  );

  renderDashboard(filtered);
}

let trainerChart, attritionChart;

function renderDashboard(data) {

  const container = document.getElementById("data");

  let totalHC = 0;
  let totalAttr = 0;
  let trainerMap = {};
  let monthAttrition = {};

  data.forEach(item => {

    const hc = Number(item["Headcount Day 0"]) || 0;
    const attr = Number((item["Attrition %"] || "0").replace("%",""));

    totalHC += hc;
    totalAttr += attr;

    // Trainer aggregation
    const trainer = item["Trainer Name"];
    trainerMap[trainer] = (trainerMap[trainer] || 0) + hc;

    // Month aggregation
    const month = item["Month"];
    monthAttrition[month] = (monthAttrition[month] || 0) + attr;
  });

  // KPIs
  document.getElementById("totalBatches").innerText = data.length;
  document.getElementById("totalHC").innerText = totalHC;
  document.getElementById("avgAttrition").innerText =
    data.length ? (totalAttr / data.length).toFixed(1) + "%" : "0%";

  // Destroy old charts
  if (trainerChart) trainerChart.destroy();
  if (attritionChart) attritionChart.destroy();

  // Trainer Chart
  trainerChart = new Chart(document.getElementById("trainerChart"), {
    type: "bar",
    data: {
      labels: Object.keys(trainerMap),
      datasets: [{
        label: "Headcount by Trainer",
        data: Object.values(trainerMap)
      }]
    }
  });

  // Attrition Chart (Month-wise)
  attritionChart = new Chart(document.getElementById("attritionChart"), {
    type: "line",
    data: {
      labels: Object.keys(monthAttrition),
      datasets: [{
        label: "Attrition %",
        data: Object.values(monthAttrition)
      }]
    }
  });

  // Cards
  container.innerHTML = data.map(item => `
    <div class="card">
      <h3>${item["Batches"]}</h3>
      <p><b>Trainer:</b> ${item["Trainer Name"]}</p>
      <p><b>Process:</b> ${item["Process"]}</p>
      <p><b>Month:</b> ${item["Month"]}</p>
      <p><b>HC:</b> ${item["Headcount Day 0"]}</p>
      <p><b>Attrition:</b> ${item["Attrition %"]}</p>
    </div>
  `).join("");
}
