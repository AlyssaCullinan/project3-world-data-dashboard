import { init } from "./map.js";
import { create_bar } from "./bar_chart.js";
import { linechart } from "./line_chart.js";
import { scatterplot } from "./scatter_plot.js";
import { create_donut_chart } from "./polarArea_chart.js";
import {
  choropleth,
  selectedCountry,
  linechartData,
  sortDescending,
} from "./map.js";

export let selectedDatayear;
export let selectedDataindictorName;
// export let selectedCountry;

document.addEventListener("DOMContentLoaded", function () {
  init();
});

async function updateMap() {
  // Example: Log selected values from dropdowns
  selectedDatayear = d3.select("#selDatayear").property("value");
  let selectedDataindicator = d3.select("#selDataindicator").property("value");
  selectedDataindictorName = d3
    .select("#selDataindicator option:checked")
    .text();

  // console.log(selectedDataindictorName);

  await choropleth(selectedDatayear, selectedDataindicator);
  create_bar(selectedDataindictorName, selectedDatayear);
  linechart("USA", selectedDataindictorName);
  scatterplot(selectedDataindictorName, selectedDatayear);
  create_donut_chart(selectedCountry, selectedDatayear);
}

// Example function when dropdown values are changed
function optionChanged(type, value) {
  console.log("optionChanged called with type:", type, "and value:", value);
  var selectedValue;

  if (type === "year") {
    selectedValue = value; // Use the passed 'value' parameter directly
    // console.log("Selected Year:", selectedValue);
  } else if (type === "indicator") {
    selectedValue = d3.select("#selDataindicator").property("value");
    // console.log("Selected Indicator:", selectedValue);
  }
}

document
  .getElementById("selDatayear")
  .addEventListener("change", function (event) {
    optionChanged("year", event.target.value);
  });

document
  .getElementById("selDataindicator")
  .addEventListener("change", function (event) {
    optionChanged("indicator", event.target.value);
  });

//  Use d3.select to bind the click event to the button
// d3.select("button").on("click", updateMap);
document.getElementById("btn").addEventListener("click", function () {
  updateMap();
});

// Function to get the selectedIndicator
export function getSelectedIndicator() {
  return d3.select("#selDataindicator").property("value");
}
