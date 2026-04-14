const API_URL = "https://opensheet.elk.sh/1DFsrdpwH5XSdNcmyXCqKE-FRFSMXQKxRj2d0Fx8S8fg/Data";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {

    console.log(data); // debug

    // ✅ TOTAL BATCHES
    const totalBatches = data.length;

    // ✅ TOTAL HEADCOUNT
    const totalHeadcount = data.reduce((sum, row) => {
      return sum + Number(row["Headcount on Start Day"] || 0);
    }, 0);

    // ✅ TOTAL ATTRITION
    const totalAttrition = data.reduce((sum, row) => {
      return sum + Number(row["Attrition"] || 0);
    }, 0);

    // ✅ AVG CONVERSION %
    let totalConv = 0;
    let count = 0;

    data.forEach(row => {
      let val = row["Conversion(Training start to end) %"];
      if (val) {
        val = val.replace("%", "");
        const num = Number(val);
        if (!isNaN(num)) {
          totalConv += num;
          count++;
        }
      }
    });

    const avgConversion = count ? (totalConv / count).toFixed(1) : 0;

    // ✅ UNIQUE TRAINERS
    const trainers = [...new Set(data.map(d => d["Trainer Name"]))];

    // ✅ UNIQUE PROCESSES
    const processes = [...new Set(data.map(d => d["Process"]))];

    // ✅ DATE RANGE
    const dates = data.map(d => new Date(d["Training Start Date"]));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const formatDate = (date) =>
      date.toLocaleString("en-IN", { month: "short", year: "numeric" });

    // ✅ BATCH RANGE
    const batchNumbers = data.map(d =>
      Number(d["Batches"].replace(/\D/g, ""))
    );

    const minBatch = Math.min(...batchNumbers);
    const maxBatch = Math.max(...batchNumbers);

    // 🎯 SET VALUES IN UI

    document.getElementById("totalBatches").innerText = totalBatches;
    document.getElementById("totalHeadcount").innerText = totalHeadcount;
    document.getElementById("totalAttrition").innerText = totalAttrition;
    document.getElementById("avgConversion").innerText = avgConversion + "%";

    document.getElementById("summaryText").innerText =
      `Batch ${minBatch} → ${maxBatch} · ${formatDate(minDate)} – ${formatDate(maxDate)} · ${trainers.length} Trainers · ${processes.length} Processes`;

  })
  .catch(err => console.error(err));
