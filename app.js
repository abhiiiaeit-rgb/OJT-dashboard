const API_URL = "https://opensheet.elk.sh/1DFsrdpwH5XSdNcmyXCqKE-FRFSMXQKxRj2d0Fx8S8fg/Data";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {

    console.log(data);

    const container = document.getElementById("data");

    let totalHC = 0;
    let totalAttrition = 0;
    let trainerMap = {};

    data.forEach(item => {

      const hc = Number(item["Headcount Day 0"]) || 0;
      const attr = Number((item["Attrition %"] || "0").replace("%",""));

      totalHC += hc;
      totalAttrition += attr;

      const trainer = item["Trainer Name"];

      if (!trainerMap[trainer]) {
        trainerMap[trainer] = 0;
      }
      trainerMap[trainer] += hc;
    });

    // KPI Updates
    document.getElementById("totalBatches").innerText = data.length;
    document.getElementById("totalHC").innerText = totalHC;
    document.getElementById("avgAttrition").innerText =
      (totalAttrition / data.length).toFixed(1) + "%";

    // Trainer Chart
    new Chart(document.getElementById("trainerChart"), {
      type: "bar",
      data: {
        labels: Object.keys(trainerMap),
        datasets: [{
          label: "Headcount by Trainer",
          data: Object.values(trainerMap)
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

  })
  .catch(err => console.error(err));
