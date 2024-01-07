import {
  selectedDatayear,
  selectedDataindictorName,
  selectedCountry,
} from "./main.js";

function linechartData() {
  return new Promise((resolve, reject) => {
    let chartData; // Declare chartData within the scope of the promise

    d3.json(`/api/data`)
      .then((data) => {
        chartData = data;
        // console.log(chartData); // Move inside the 'then' block to log after data is fetched
        resolve(chartData);
      })
      .catch(reject);
  });
}

async function linechart(selectedCountry, selectedDataindictorName) {
  // console.log(selectedCountry);
  let chartData = await linechartData();
  // console.log(chartData);

  // console.log(chartData);

  let linechart3filter = chartData.filter(
    (data) =>
      data.country_code === selectedCountry &&
      data.series_name === selectedDataindictorName
  );
  // / map the data for the labels
  let chartedLabels = linechart3filter.map((data) => data.years);
  let linechartvalues = linechart3filter.map((data) => data.indicator_value);

  // add the dataset to the dataset param
  let linechart3_data = {
    labels: chartedLabels,
    datasets: [
      { label: selectedCountry, data: linechartvalues, borderWidth: 1 },
    ],
  };
  let lineOptions3 = {
    // indexAxis: 'y',
    animation: false,
    plugins: {
      title: {
        display: true, // enables the title
        text: selectedDataindictorName + "Chart for " + selectedCountry, // the title text
        font: {
          // the title font
          size: 20,
        },
        color: "black", // the title color
        padding: 10, // the title padding
      },
    },
    scales: {
      x: {
        // ticks:{
        // maxTicksLimit: 9
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  const existingChart = Chart.getChart(document.getElementById("lineChart"));
  if (existingChart) {
    // Destroy the existing chart if it exists
    existingChart.destroy();
  }
  let ctx = document.getElementById("lineChart").getContext("2d");

  let mylineChart5 = new Chart(ctx, {
    type: "line",
    data: linechart3_data,
    options: lineOptions3,
  });
}

export { linechart };
