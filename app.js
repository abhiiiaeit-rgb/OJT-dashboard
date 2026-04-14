const API_URL = "https://opensheet.elk.sh/1DFsrdpwH5XSdNcmyXCqKE-FRFSMXQKxRj2d0Fx8S8fg/Data";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    console.log(data);

    const container = document.getElementById("data");

    container.innerHTML = data.map(item => `
      <div style="border:1px solid #ddd; padding:12px; margin:10px; border-radius:8px;">
        <h3>${item["Batches"]}</h3>
        <p><b>Trainer:</b> ${item["Trainer Name"]}</p>
        <p><b>Process:</b> ${item["Process"]}</p>
        <p><b>Month:</b> ${item["Month"]}</p>
        <p><b>Headcount:</b> ${item["Headcount Day 0"]}</p>
        <p><b>Attrition %:</b> ${item["Attrition %"]}</p>
        <p><b>PKT %:</b> ${item["PKT Certification %"]}</p>
      </div>
    `).join("");
  })
  .catch(err => console.error(err));
