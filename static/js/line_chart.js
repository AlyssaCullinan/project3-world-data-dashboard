import { selectedCountry, linechartData } from "./map.js";

import { selectedDatayear, selectedDataindictorName } from "./main.js";

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
    // responsive: false,
    animation: false,
    plugins: {
      title: {
        display: true, // enables the title
        text: "Line Chart", // the title text
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
