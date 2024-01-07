import { selectedCountry, linechartData, sortDescending } from "./map.js";

import { selectedDatayear, selectedDataindictorName } from "./main.js";

// create Charts.JS Scatter Plot
export async function scatterplot(selectedDataindicator, selectedDatayear) {
  // console.log(selectedCountry);
  let chartData = await linechartData();
  // filter data for ChartsJS scatterplot
  let filtered_data = chartData.filter(
    (data) =>
      (data.series_name == selectedDataindicator ||
        data.series_name == "GDP growth (annual %)" ||
        data.series_name == "Population, total") &&
      data.years == selectedDatayear
  );

  let scatterplot2 = document.getElementById("scatterplot").getContext("2d");
  // let sizerefbubble = 2.0 * Math.max(...filtered_data3.map(d => d[4]))/(40**2)
  let ybubble = filtered_data
    .filter((data) => data.series_name == selectedDataindicator)
    .map((data) => data.indicator_value);
  let xbubble = filtered_data
    .filter((data) => data.series_name == "GDP growth (annual %)")
    .map((data) => data.indicator_value);
  // let sortedCountrybubble = filtered_data.filter((data) => data.series_name == "GDP growth (annual %)").map((data) => data.indicator_value);
  let sortedx = xbubble.sort(sortDescending).slice(0, 50);
  let sortedy = ybubble.sort(sortDescending).slice(0, 50);
  // let sortedCountries = sortedCountrybubble.sort(sortAscending).slice(0,50);

  // let sortedCustomData = filtered_data.map((data) => data.country_name).sort(sortAscending).slice(0,30)
  let scatterData = filtered_data.map((d, i) => ({
    x: sortedx[i],
    y: sortedy[i],
    country: d.country_name,
  }));

  const existingscatterChart = Chart.getChart(
    document.getElementById("scatterplot")
  );
  if (existingscatterChart) {
    // Destroy the existing chart if it exists
    existingscatterChart.destroy();
  }
  let config2 = new Chart(scatterplot2, {
    type: "bubble",
    data: {
      datasets: [
        {
          // label: selectedDatayear,
          data: scatterData,
          borderWidth: 2,
          showLine: true,
          hovertemplate: "Country: <%= dataset.data[i].country%>",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
          responsive: true,
          maintainAspectRatio: false, // This might be used instead of aspectRatio
          width: 400,
        },
        title: {
          display: true, // enables the title
          text:
            "Top 30 Countries: GDP Growth (annual %) vs." +
            " " +
            selectedDataindicator +
            " in " +
            selectedDatayear, // the title text
          font: {
            // the title font
            size: 20,
          },
          color: "black", // the title color
          padding: 10, // the title padding
        },
      },

      // aspectRatio: 1,

      scales: {
        x: {
          title: {
            display: true,
            text: selectedDataindicator,
          },
          autorange: true,
          ticks: {
            stepSize: 1,
          },
        },
        y: {
          title: {
            display: true,
            text: "GDP growth (annual %)",
          },
          autorange: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
  // render the scatterplot chart
  config2.render();
}
// scatterplot(selectedDatayear, selectedDataindictorName);
