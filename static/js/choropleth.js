let map;
let geojson;
let IndicatorData;
let info;
let indicatorSelector;
let yearSelector;
let yearData;
let indicatorData;
let selectedCountry;
let selectedDatayear;
let selectedDataindicator;
let wholeData;
let selectedDataindictorName;
// export {
//   selectedCountry,
//   selectedDataindicator,
//   selectedDatayear,
//   indicatorData,
// };

// Function that fetches the indicator value for a given country code and indicator
function getIndicatorValue(countryCode, data, selectedIndicator) {
  selectedCountry = countryCode;
  // console.log(countryCode);
  const countryData = data.find((entry) => entry.country_code === countryCode);
  // console.log(countryData);
  return countryData
    ? [countryData.indicator_value, countryData.series_code]
    : 0;
  // return countryData ? countryData[selectedIndicator] : 0;
}

// Function to add color based on population amount
function getColor(indicatorValue, indicator) {
  // console.log(indicator);
  // console.log(indicatorValue);
  return indicatorValue >= 2000000000
    ? "#800026" // Red for populations greater than or equal to 2 billion
    : indicatorValue >= 1000000000
    ? "#BD0026" // Dark red for populations greater than or equal to 1 billion
    : indicatorValue >= 500000000
    ? "#E31A1C" // Orange-red for populations greater than or equal to 500 million
    : indicatorValue >= 200000000
    ? "#FC4E2A" // Orange for populations greater than or equal to 200 million
    : indicatorValue >= 100000000
    ? "#FD8D3C" // Dark orange for populations greater than or equal to 100 million
    : indicatorValue >= 50000000
    ? "#FEB24C" // Yellow for populations greater than or equal to 50 million
    : indicatorValue >= 20000000
    ? "#FED976" // Light yellow for populations greater than or equal to 20 million
    : "#FFEDA0"; // Pale yellow for populations less than 20 million
}

// Function to style the GeoJSON features
function style(feature) {
  let selectedIndicator = getSelectedIndicator();
  const indicator = getIndicatorValue(
    feature.id,
    indicatorData,
    selectedIndicator
  );
  // console.log(selectedIndicator);

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
  // console.log(selectedCountry);
  const popupContent =
    "<b>" +
    layer.feature.properties.name +
    "</b><br/>" +
    (indicator[0] ? formatPopulation(indicator[0]) : "No data available");

  layer.bindPopup(popupContent).openPopup();
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
function choropleth(year, indicator) {
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
async function init() {
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
    selectedDatayear = d3.select("#selDatayear").property("value");
    selectedDataindicator = d3.select("#selDataindicator").property("value");

    // console.log(selectedDataindicator);
    // console.log(indicator[0].series_code);
    await choropleth(year[0], indicator[0].series_code);
    if (wholeData) {
      create_bar(indicator[0].series_name, indicator[0].year);
    } else {
      console.error("Error initializing: wholeData is undefined");
    }
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

async function updateMap() {
  // Example: Log selected values from dropdowns
  selectedDatayear = d3.select("#selDatayear").property("value");
  selectedDataindicator = d3.select("#selDataindicator").property("value");
  selectedDataindictorName = d3
    .select("#selDataindicator option:checked")
    .text();

  console.log(selectedDataindictorName);

  await choropleth(selectedDatayear, selectedDataindicator);
  create_bar(selectedDataindictorName, selectedDatayear);
}

// Example function when dropdown values are changed
function optionChanged(type, value) {
  // console.log("Dropdown selected:", type, value);

  var selectedValue;

  if (type === "year") {
    selectedValue = value; // Use the passed 'value' parameter directly
    // console.log("Selected Year:", selectedValue);
  } else if (type === "indicator") {
    selectedValue = d3.select("#selDataindicator").property("value");
    // console.log("Selected Indicator:", selectedValue);
  }
}
//  Use d3.select to bind the click event to the button
d3.select("button").on("click", updateMap);

// Function to get the selectedIndicator
function getSelectedIndicator() {
  return d3.select("#selDataindicator").property("value");
}

// #######################################################
// create functions to sort the data
function sortDescending(a, b) {
  return b[1] - a[1];
}
function sortAscending(a, b) {
  return a[1] - b[1];
}

function create_bar(selectedSeries, selectedYear) {
  // console.log(selectedSeries, selectedYear);
  console.log(indicatorData);
  console.log(selectedSeries);

  // create a filter for the selected series
  // let filtered_data = indicatorData.filter(
  //   (d) => d[4] === selectedSeries && d[5] === selectedYear
  // );

  // console.log(filtered_data);
  // select only the top 10 countries
  let sortedData = indicatorData.sort(sortDescending).slice(0, 10);
  // create a variable for the  series indicator value and a variable for the country
  // console.log(sortedData);
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
    title:
      "The Top 10: Bar Chart of " + selectedSeries + " " + "in " + selectedYear,
    // width: 400,
    xaxis: {
      // add the range slider to the bottom of the graph
      title: "Country Name",
      // sort the bar chart in ascending order
      categoryorder: "total ascending",
      // rangeselector: {
      //     buttons: [
      //         {count: 1, label: '1y', step: 'year', stepmode: 'backward'},{step: 'all'}
      //     ]
      // },
      // rangeslider:{},
      // autorange:true,
    },
    yaxis: {
      title: selectedSeries,
    },
  };

  let top10BarData = [trace];
  Plotly.newPlot("line_chart", top10BarData, barLayout);
}

// call bar chart function - later replace parameters with variable for year and series indicator drop downs
// create_bar(selectedDataindicator, 2021);

// #######################################################

document.addEventListener("DOMContentLoaded", function () {
  init();
});
