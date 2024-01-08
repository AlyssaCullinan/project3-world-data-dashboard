import { linechart } from "./line_chart.js";
import { create_bar } from "./bar_chart.js";
import { scatterplot } from "./scatter_plot.js";
import { create_donut_chart } from "./polarArea_chart.js";
import { getSelectedIndicator } from "./main.js";
import { selectedDatayear, selectedDataindictorName } from "./main.js";

let map;
let geojson;
let IndicatorData;
let info;
let indicatorSelector;
let yearSelector;
let yearData;
let indicatorData;
let selectedCountry;
//let selectedDatayear;
let selectedDataindicator;
let wholeData;
//let selectedDataindictorName;
let indicatorValues = [];
let minIndicatorValue = 0;
let maxIndicatorValue = 0;
let chartData;

function getIndicatorValue(countryCode, data, selectedIndicator) {
  // selectedCountry = countryCode;
  // console.log(countryCode);
  const countryData = data.find((entry) => entry.country_code === countryCode);
  // console.log(countryData);
  return countryData
    ? [countryData.indicator_value, countryData.series_code]
    : 0;
  // return countryData ? countryData[selectedIndicator] : 0;
}

// Function that fetches the indicator value for a given country code and indicator
function colorScales(indicatorValue, indicator) {
  // console.log(indicator);
  // Calculate the dynamic domain based on the indicator values
  minIndicatorValue = d3.min(indicatorValues);
  maxIndicatorValue = d3.max(indicatorValues);
  const mid1 =
    minIndicatorValue + (maxIndicatorValue - minIndicatorValue) * (1 / 7);
  const mid2 =
    minIndicatorValue + (maxIndicatorValue - minIndicatorValue) * (2 / 7);
  const mid3 =
    minIndicatorValue + (maxIndicatorValue - minIndicatorValue) * (3 / 7);
  const mid4 =
    minIndicatorValue + (maxIndicatorValue - minIndicatorValue) * (4 / 7);
  const mid5 =
    minIndicatorValue + (maxIndicatorValue - minIndicatorValue) * (5 / 7);
  const mid6 =
    minIndicatorValue + (maxIndicatorValue - minIndicatorValue) * (6 / 7);
  const mid7 = maxIndicatorValue;
  console.log();
  if (indicator === "NY.GDP.MKTP.KD.ZG") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 1, 3, 4, 5, 6, 7, maxIndicatorValue])
      .range([
        "#B3B3CC", // Purple for negatives (minvalue)
        "#E5F5E0", // Honeydew (2)
        "#C7E9C0", // Pale Green (3)
        "#A1D99B", // Light Green (4)
        "#74C476", // Medium Green (5)
        "#41AB5D", // Green (6)
        "#238B45", // Dark Green (7)
        "#005A32", // Forest Green (maxval)
      ]);
  } else if (indicator == "SP.POP.GROW") {
    return d3
      .scaleLinear()
      .domain([
        minIndicatorValue,
        0.5,
        1.5,
        2.5,
        3.5,
        4.5,
        5.5,
        6.5,
        maxIndicatorValue,
      ])
      .range([
        "#B3B3CC", // Purple for negatives (minvalue)
        "#E5F5E0", //.5
        "#C7E9C0", //1.5
        "#A1D99B", //2.5
        "#74C476", //3.5
        "#41AB5D", //4.5
        "#238B45", //5.5
        "#005A32", //6.5
        "#033500", // max val
      ]);
  } else if (indicator === "SP.POP.TOTL") {
    return d3
      .scaleLinear()
      .domain([
        minIndicatorValue,
        20000000,
        50000000,
        100000000,
        200000000,
        500000000,
        1000000000,
        2000000000,
        maxIndicatorValue,
      ])
      .range([
        "#FFEDA0", // Pale yellow for populations less than 20 million
        "#FED976", // Light yellow for populations greater than or equal to 20 million
        "#FEB24C", // Yellow for populations greater than or equal to 50 million
        "#FD8D3C", // Dark orange for populations greater than or equal to 100 million
        "#FC4E2A", // Orange for populations greater than or equal to 200 million
        "#E31A1C", // Orange-red for populations greater than or equal to 500 million
        "#BD0026", // Dark red for populations greater than or equal to 1 billion
        "#800026", // Red for populations greater than or equal to 2 billion
      ]);
  } else if (indicator === "NY.GDP.MKTP.CD") {
    return d3
      .scaleThreshold()
      .domain([
        19456338.03, 1000000000, 50000000000, 100000000000, 500000000000,
        1000000000000, 5000000000000, 10000000000000, 20000000000000,
        25000000000000,
      ])
      .range([
        "#FEE5D9",
        "#FCBBA1",
        "#FC9272",
        "#FB6A4A",
        "#DE2D26",
        "#A50F15",
        "#67000D",
        "#330000",
      ]);
  } else if (indicator === "MS.MIL.XPND.CD") {
    return d3
      .scaleThreshold()
      .domain([
        0, 1000000000, 5000000000, 10000000000, 50000000000, 100000000000,
        500000000000, 1000000000000, 877000000000,
      ])
      .range([
        "#FFEDA0", // Pale yellow for values less than 500 million
        "#FED976", // Light yellow for values between 500 million and 1 billion
        "#FEB24C", // Yellow for values between 1 billion and 5 billion
        "#FD8D3C", // Dark orange for values between 5 billion and 10 billion
        "#FC4E2A", // Orange for values between 10 billion and 50 billion
        "#E31A1C", // Orange-red for values between 50 billion and 100 billion
        "#BD0026", // Dark red for values between 100 billion and 500 billion
        "#800026", // Red for values greater than 500 billion
      ]);
  } else if (indicator === "SH.XPD.CHEX.PC.CD") {
    return d3
      .scaleLog()
      .domain([0.5, 20, 40, 1000, 2000, 5000, 8000, 10000, 12000])
      .range([
        "#F7FBFF", // Light Blue (0.5)
        "#D3EAF8", // Lighter Blue (20)
        "#A1C9E3", // Medium Blue (40)
        "#6B9ACF", // Darker Blue (1000)
        "#4B7CAB", // Steel Blue (2000)
        "#30618B", // Medium Blue (5000)
        "#1F4872", // Dark Blue (8000)
        "#113260", // Navy Blue (10000)
      ]);
  } else if (indicator === "NV.AGR.TOTL.ZS") {
    return d3
      .scaleLinear()
      .domain([0, 3, 7.5, 10.5, 15.5, 20.5, 25.5, 30.5, 35.5, 40, 50, 55])
      .range([
        "#B0E0E6", // Powder Blue (0)
        "#DFF5FF", // Lighter Blue-Green (3)
        "#A2D4C9", // Pale Green (7.5)
        "#BAE4B3", // Light Green (10.5)
        "#A2D99B", // Medium Green (15.5)
        "#79C279", // Green (20.5)
        "#56B56F", // Darker Green (25.5)
        "#399C6E", // Dark Green (30.5)
        "#1F8B4C", // Forest Green (35.5)
        "#00703C", // Deep Green (40)
        "#005A32", // Very Dark Green (50)
        "#FF0000", // Red (51 and above)
      ]);
  } else if (indicator === "SH.XPD.CHEX.GD.ZS") {
    return d3.scaleLinear().domain([0, 5, 10, 15, 20, 25]).range([
      "#EFF3FF", // Alice Blue
      "#BDD7E7", // Sky Blue
      "#6BAED6", // Steel Blue
      "#3182BD", // Royal Blue
      "#08519C", // Navy Blue
      "#08306B", // Dark Navy Blue
    ]);
  } else if (indicator === "SE.XPD.TOTL.GD.ZS") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 1, 2, 3, 4, 5, maxIndicatorValue])
      .range([
        "#F0F8FF", // Alice Blue
        "#B0E0E6", // Powder Blue
        "#87CEEB", // Sky Blue
        "#4682B4", // Steel Blue
        "#4169E1", // Royal Blue
        "#000080", // Navy Blue
        "#001F3F", // Dark Navy Blue
      ]);
  } else if (indicator === "NE.IMP.GNFS.ZS" || indicator === "NE.EXP.GNFS.ZS") {
    return d3
      .scaleLinear()
      .domain([
        minIndicatorValue,
        20,
        30,
        40,
        60,
        80,
        100,
        120,
        140,
        160,
        180,
        200,
        maxIndicatorValue,
      ])
      .range([
        "#FFF5EB", // Lightest Orange
        "#FDD0A2", // Light Orange
        "#FDAE6B", // Medium Light Orange
        "#FD8D3C", // Medium Orange
        "#E6550D", // Dark Orange
        "#D94701", // Darker Orange
        "#C53502", // Very Dark Orange
        "#B02C02", // Deep Orange
        "#A12900", // Dark Reddish Orange
        "#8C2600", // Darker Reddish Orange
        "#7F2200", // Very Dark Reddish Orange
        "#701C00", // Almost Brown
      ]);
  } else if (indicator === "FP.CPI.TOTL.ZG") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, -10, -5, 0, 2, 5, 10, 20, maxIndicatorValue])
      .range([
        "#0571B0", // Dark Blue (min value)
        "#92C5DE", // Light Blue (-10)
        "#D1E5F0", // Very Light Blue (-5)
        "#F7F7F7", // White (0)
        "#FDDBC7", // Very Light Red (2)
        "#F4A582", // Light Red (5)
        "#D6604D", // Dark Red (10)
        "#B2182B", // Darker Red (20)
        "#67001F", // Darkest Red (max value)
      ]);
  } else if (indicator === "MS.MIL.XPND.GD.ZS") {
    return d3
      .scaleLinear()
      .domain([
        minIndicatorValue,
        0.5,
        1.5,
        3,
        3.5,
        5,
        8.5,
        10,
        maxIndicatorValue,
      ])
      .range([
        "#FFF5F0",
        "#FEE0D2",
        "#FCBBA1",
        "#FC9272",
        "#FB6A4A",
        "#EF3B2C",
        "#CB181D",
        "#99000D",
        "#67001F",
      ]);
  } else {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, maxIndicatorValue])
      .range(["#CCCCCC", "#CCCCCC"]); // Default scale if indicator is not found
  }
}

// Function to add color based on population amount
function getColor(indicatorValue, indicator) {
  if (indicatorValue) {
    indicatorValues.push(indicatorValue);
  }
  // console.log(indicatorValues);

  if (indicatorValues.length === 0) {
    // No data available, return a default color
    return "#CCCCCC"; // You can change this to your preferred default color
  }

  const scale = colorScales(indicatorValue, indicator);

  return scale(indicatorValue);
}

// Function to style the GeoJSON features
function style(feature) {
  let selectedIndicator = getSelectedIndicator();
  const indicator = getIndicatorValue(
    feature.id,
    indicatorData,
    selectedIndicator
  );
  // console.log(indicator);

  return {
    fillColor: getColor(indicator[0], selectedIndicator),
    weight: 0, // Set border weight to 0
    opacity: 0, // Set border opacity to 0
    color: "transparent", // Set border color to transparent
    fillOpacity: 0.6,
  };
}

function highlightFeature(e) {
  let layer = e.target;
  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.6,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  const indicator = getIndicatorValue(layer.feature.id, indicatorData);
  // console.log(layer.feature);
  selectedCountry = layer.feature.id;

  const popupContent =
    "<b>" +
    layer.feature.properties.name +
    "</b><br/>" +
    // (indicator[0] ? formatPopulation(indicator[0]) : "No data available");
    (indicator[0] ? indicator[0] : "No data available");
  layer.bindPopup(popupContent).openPopup();

  linechart(selectedCountry, selectedDataindictorName);
  create_donut_chart(selectedCountry, selectedDatayear);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  //   info.update();
}

// Click listener that zooms to country on click
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

// Add listeners on countries layer
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });

  // Disable displaying country names on the map
  layer.bindTooltip("");
}

// Create choropleth function to be called at various years
export function choropleth(year, indicator) {
  // Reset existing style layer before applying a new one
  return new Promise((resolve, reject) => {
    // Reset existing style layer before applying a new one
    if (geojson) {
      map.removeLayer(geojson);
    }

    d3.json(`/api/data/choropleth/${indicator}/${year}`)
      .then((data) => {
        indicatorData = data;
        wholeData = data;
        // console.log(wholeData);
        return d3.json(`/api/v2.0/choropleth/geo`);
      })
      .then(function (geoData) {
        geojson = L.geoJson(geoData, {
          style: style,
          onEachFeature: onEachFeature,
        }).addTo(map);

        resolve(); // Resolve the promise when the data is loaded
      })
      .catch((error) => {
        reject(error); // Reject the promise if there's an error
      });

    info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      return this._div;
    };

    info.addTo(map);
  });
}

// Function to format population in millions or billions
function formatPopulation(population) {
  if (population >= 1000000000) {
    return (
      (population / 1000000000)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " billion"
    );
  } else if (population >= 1000000) {
    return (
      (population / 1000000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      " million"
    );
  } else {
    return (
      population.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "thousand"
    );
  }
}

// Function to populate the year dropdown
function yearDropdown() {
  return new Promise((resolve, reject) => {
    d3.json(`/api/data/year`)
      .then((data) => {
        yearData = data;
        // console.log(yearData);
        // year = yearData;
        yearSelector = d3.select("#selDatayear");
        // Add samples to dropdown menu
        yearData.forEach((year) => {
          yearSelector.append("option").text(year).property("value", year);
        });
        resolve(yearData);
      })
      .catch(reject);
  });
}

// Function to populate the indicator dropdown
function indicatorDropdown() {
  return new Promise((resolve, reject) => {
    d3.json(`/api/data/indicators`)
      .then((data) => {
        indicatorData = data;
        indicatorSelector = d3.select("#selDataindicator");

        // Add samples to dropdown menu
        indicatorData.forEach((indicator) => {
          indicatorSelector
            .append("option")
            .text(indicator.series_name)
            .property("value", indicator.series_code); // Use the desired property here
        });
        resolve(indicatorData);
      })
      .catch(reject);
  });
}

// Function to initialize the choropleth
export async function init() {
  // Add base layer
  map = L.map("map", {
    // center: [17.5707, -3.9932], // Initial center coordinates
    center: [0, 0],
    zoom: 1.75, // Initial zoom level
    zoomControl: false, // Disable zoom control
    dragging: false, // Disable map dragging
    tap: false, // Disable tap events
    touchZoom: false, // Disable touch zoom
    scrollWheelZoom: false, // Disable scroll wheel zoom
    doubleClickZoom: false, // Disable double click zoom
    boxZoom: false, // Disable box zoom
    keyboard: false, // Disable keyboard navigation
    maxZoom: 7, // Set the maximum zoom level
    //backgroundColor: "#f0f0f0",
  });

  // Add tile layer
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 7,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Disable dragging after map initialization
  map.dragging.disable();
  try {
    let year = await yearDropdown();
    let indicator = await indicatorDropdown();

    // Set default selections
    let selectedDatayear1 = d3.select("#selDatayear").property("value");
    // selectedDataindicator = d3.select("#selDataindicator").property("value");
    let selectedDataindictorName1 = d3
      .select("#selDataindicator option:checked")
      .text();

    await choropleth(year[0], indicator[0].series_code);
    if (wholeData) {
      // console.log(year);
      create_bar(selectedDataindictorName1, selectedDatayear1);
      linechart("IND", selectedDataindictorName1);
      scatterplot(selectedDataindictorName1, selectedDatayear1);
      create_donut_chart("IND", selectedDatayear1);
    } else {
      console.error("Error initializing: wholeData is undefined");
    }
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

// #######################################################
// create functions to sort the data

export function sortDescending(a, b) {
  return b.indicator_value - a.indicator_value;
}

// #######################################################
function linechartData() {
  return new Promise((resolve, reject) => {
    //  chartData; // Declare chartData within the scope of the promise

    d3.json(`/api/data`)
      .then((data) => {
        chartData = data;
        // console.log(chartData); // Move inside the 'then' block to log after data is fetched
        resolve(chartData);
      })
      .catch(reject);
  });
}
// ############################################################

// ####################################################################################

export {
  // selectedDataindictorName,
  // selectedDatayear,
  selectedCountry,
  indicatorData,
  linechartData,
  // sortDesceding,
};
