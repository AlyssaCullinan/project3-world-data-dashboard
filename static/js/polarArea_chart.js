import { selectedCountry, linechartData, sortDescending } from "./map.js";
import { selectedDatayear, selectedDataindictorName } from "./main.js";

function getDonutchartData() {
  return new Promise((resolve, reject) => {
    let donutChartData; // Declare chartData within the scope of the promise

    d3.json(`/api/data/GDPdata`)
      .then((data) => {
        donutChartData = data;
        resolve(donutChartData);
      })
      .catch(reject);
  });
}

// function getDonutchartData() {
//   return new Promise((resolve, reject) => {
//     let donutChartData; // Declare chartData within the scope of the promise

//     d3.json(`/api/data/GDPdata`)
//       .then((data) => {
//         donutChartData = data;
//         resolve(donutChartData);
//       })

//       .catch((error) => {
//         console.error("Error fetching data", error);
//         reject(error);
//       })
//       .finally(() => {
//         console.log("resolution");
//       });
//   });
// }

// getDonutchartData();

export async function create_donut_chart(selectedCountry, selectedDatayear) {
  let donutChartData = await getDonutchartData();

  let donutFilter = donutChartData.filter(
    (data) =>
      data.country_code == selectedCountry && data.years == selectedDatayear
  );
  //   console.log("fillteerrrr", donutFilter);
  if (donutFilter.length === 0) {
    console.log("no data found");
  }
  let donut_data = {
    labels: donutFilter.map((data) => data.series_name),
    datasets: [
      {
        data: donutFilter.map((data) => data.indicator_value),
        // backgroundColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', 'brown'],
        // borderColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', 'brown'],
        // borderWidth: 3,
        order: 1,
      },
    ],
  };

  let donutOptions = {
    animation: true,
    scale: {
      ticks: {
        fontSize: 10, // Set font size for scale ticks
      },
    },

    // responsive: false, // Set to false to specify fixed width and height
    responsive: true,
    maintainAspectRatio: false,
    width: 800, // Set the width of the chart
    // height: 400,
    plugins: {
      title: {
        display: true, // enables the title
        text: "Polar Area Chart for " + selectedCountry, // the title text
        font: {
          // the title font
          size: 15,
        },

        color: "black", // the title color
        padding: 2, // the title padding
      },
      legend: {
        position: "right", // Set the legend position to 'right'
        labels: {
          fontSize: 12,
        },
      },
    },
  };

  const existingdonutChart = Chart.getChart(
    document.getElementById("donutchart")
  );
  if (existingdonutChart) {
    existingdonutChart.destroy();
  }
  // create variable to get the element in the HTML file
  let ctx = document.getElementById("donutchart").getContext("2d");

  let mydonutChart = new Chart(ctx, {
    type: "polarArea",
    data: donut_data,
    options: donutOptions,
  });
}
