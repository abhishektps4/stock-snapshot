async function getStockData() {
  const apiKey = "d554a3db27ef49c6b0140f10ccfc1324"; // 🔁 Replace with your real API key
  const tickerInput = document.getElementById("tickerInput");
  const ticker = tickerInput.value.trim().toUpperCase();

  // Validate input
  if (!/^[A-Z]{1,5}$/.test(ticker)) {
    alert("❗ Enter a valid stock ticker (1-5 uppercase letters).");
    return;
  }

  const url = `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("🔍 API Response:", data); // For debugging

    if (data.status === "error" || data.code || data.message) {
      alert(`❌ Error: ${data.message || "Invalid ticker or API key"}`);
      return;
    }

    // Populate DOM with result
    document.getElementById("stockName").textContent = data.name;
    document.getElementById("price").textContent = parseFloat(data.price).toFixed(2);

    const changePercent = parseFloat(data.percent_change).toFixed(2);
    const changeElement = document.getElementById("change");
    changeElement.textContent = `${changePercent}%`;
    changeElement.className = changePercent >= 0 ? "positive" : "negative";

    // Optional mini chart using QuickChart (with fake data)
    const chartData = generateFakeData(changePercent);
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
      type: 'sparkline',
      data: {
        datasets: [{
          data: chartData,
          borderColor: changePercent >= 0 ? 'green' : 'red',
          fill: false
        }]
      }
    }))}`;

    document.getElementById("chart").src = chartUrl;
    document.getElementById("result").classList.remove("hidden");
  } catch (error) {
    alert("⚠️ Network error or API not responding.");
    console.error(error);
  }
}

// Generate fake chart data for simple visualization
function generateFakeData(change) {
  const base = 100;
  const fluctuation = Math.abs(change) / 10;
  const arr = [base];
  for (let i = 0; i < 9; i++) {
    const val = arr[i] + (Math.random() - 0.5) * fluctuation;
    arr.push(Number(val.toFixed(2)));
  }
  return arr;
}
