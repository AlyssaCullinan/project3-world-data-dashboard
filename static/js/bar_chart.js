import {
  // selectedDatayear,
  // selectedDataindictorName,
  selectedCountry,
  linechartData,
  indicatorData,
} from "./map.js";

import { selectedDatayear, selectedDataindictorName } from "./main.js";
export function create_bar(selectedDataindictorName, selectedYear) {
  // select only the top 10 countries
  let sortedData = indicatorData
    .sort((a, b) => b.indicator_value - a.indicator_value)
    .slice(0, 10);

  let indicator_val = sortedData.map((d) => d.indicator_value);
  // console.log(indicator_val);
  let country = sortedData.map((d) => d.country_name);
  // create the trace object
  let trace = {
    x: country,
    y: indicator_val,
    type: "bar",
    // orientation: 'h',
    marker: {
      color: [
        "#FD7F6F",
        "#7EB0D5",
        "#B2E061",
        "#BD7EBE",
        "#FFB55A",
        "#FFEE65",
        "#BEB9DB",
        "#FDCCCE",
        "#8BD3C7",
        "brown",
      ],
    },
  };
  // create the layout
  let barLayout = {
    // make the title auto-update depending on the selected year and series

    title: {
      text: "Top 10 " + selectedDataindictorName,
      font: {
        size: 12,
        bold: true,
      },
    },
    height: 350,
    width: 570,
    xaxis: {
      // add the range slider to the bottom of the graph
      title: {
        text: "Country Name",
        font: {
          size: 10, // Adjust the font size for the x-axis title
        },
      },

      tickfont: {
        size: 10, // Adjust the font size for the y-axis labels
      },
      // sort the bar chart in ascending order
      categoryorder: "total ascending",
      automargin: true,
    },
    yaxis: {
      title: {
        text: selectedDataindictorName,
        font: {
          size: 10, // Adjust the font size for the y-axis title
        },
      },
      tickfont: {
        size: 10, // Adjust the font size for the y-axis labels
      },
      // automargin: true,
    },
    modebar: {
      // Remove the buttons you don't want
      orientation: "v",
      modeBarButtonsToRemove: [],
    },
    hovermode: false, // Disable hover interactions
    autosize: false,
  };

  let top10BarData = [trace];
  Plotly.newPlot("bar_chart", top10BarData, barLayout);
}
