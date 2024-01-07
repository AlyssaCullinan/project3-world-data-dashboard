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
let indicatorValues = [];
let minIndicatorValue = 0;
let maxIndicatorValue = 0;
let chartData;
// let colorScales;
// export {
//   selectedCountry,
//   selectedDataindicator,
//   selectedDatayear,
//   indicatorData,
// };

// Function that fetches the indicator value for a given country code and indicator
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
  console.log()
if (indicator === "NE.EXP.GNFS.ZS") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 20, 30, 40, 50, 60, 80, maxIndicatorValue])
      .range([
        "#F0EAD6",  // Eggshell
        "#DAC1A0",  // Tan
        "#BFA581",  // Light Brown
        "#A9865A",  // Brown
        "#8F6F43",  // Dark Brown
        "#72582D",  // Chocolate
        "#4E3D28",  // Espresso
        "#3C2817",  // Coffee
      ]);
  } else if (indicator === "NY.GDP.MKTP.KD.ZG" || indicator == 'SP.POP.GROW') {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 2, 3, 4, 5, 6, 7, maxIndicatorValue])
      .range([
        "#F7FCF5",  // Mint Cream
        "#E5F5E0",  // Honeydew
        "#C7E9C0",  // Pale Green
        "#A1D99B",  // Light Green
        "#74C476",  // Medium Green
        "#41AB5D",  // Green
        "#238B45",  // Dark Green
        "#005A32",  // Forest Green
      ]);
  } else if (indicator === "SP.POP.TOTL" || indicator == "MS.MIL.XPND.CD") {
    return d3
      .scaleLinear()
      .domain([
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
          500000000,    // Adjusted breakpoints based on your data
          1000000000,
          5000000000,
          10000000000,
          50000000000,
          100000000000,
          500000000000,
          1000000000000, // Adjusted upper limit based on your data
          maxIndicatorValue,
        ])
        .range(["#fee5d9", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#67000d"]);
  } else if (indicator === "MS.MIL.XPND.CD") {
    return d3
      .scaleLinear()
      .domain([
        0,
        1000000000,
        5000000000,
        10000000000,
        50000000000,
        100000000000,
        500000000000,
        1000000000000,
        877000000000,
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
        .domain([
          0.5,
          20,
          40,
          1000,
          2000,
          5000,
          8000,
          10000,
          12000,
        ])
        .range([
          "#F7FBFF",  // Light Blue (0.5)
          "#D3EAF8",  // Lighter Blue (20)
          "#A1C9E3",  // Medium Blue (40)
          "#6B9ACF",  // Darker Blue (1000)
          "#4B7CAB",  // Steel Blue (2000)
          "#30618B",  // Medium Blue (5000)
          "#1F4872",  // Dark Blue (8000)
          "#113260",  // Navy Blue (10000)
        ]);
  
    } else if (indicator === "NV.AGR.TOTL.ZS") {
      return d3
        .scaleLinear()
        .domain([0, 3, 7.5, 10.5, 15.5, 20.5, 25.5, 30.5, 35.5, 40, 50, 55])
        .range([
          "#B0E0E6",  // Powder Blue (0)
          "#DFF5FF",  // Lighter Blue-Green (3)
          "#A2D4C9",  // Pale Green (7.5)
          "#BAE4B3",  // Light Green (10.5)
          "#A2D99B",  // Medium Green (15.5)
          "#79C279",  // Green (20.5)
          "#56B56F",  // Darker Green (25.5)
          "#399C6E",  // Dark Green (30.5)
          "#1F8B4C",  // Forest Green (35.5)
          "#00703C",  // Deep Green (40)
          "#005A32",  // Very Dark Green (50)
          "#FF0000",  // Red (51 and above)
        ]);

    } else if (indicator === "SH.XPD.CHEX.GD.ZS") {
    return d3
      .scaleLinear()
      .domain([
        0,
        5,
        10,
        15,
        20,
        25,
      ])
      .range([
        "#EFF3FF",  // Alice Blue
        "#BDD7E7",  // Sky Blue
        "#6BAED6",  // Steel Blue
        "#3182BD",  // Royal Blue
        "#08519C",  // Navy Blue
        "#08306B",  // Dark Navy Blue
      ]);
  } else if (indicator === "SE.XPD.TOTL.GD.ZS") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 1, 2, 3, 4, 5, maxIndicatorValue])
      .range([
        "#F0F8FF",  // Alice Blue
        "#B0E0E6",  // Powder Blue
        "#87CEEB",  // Sky Blue
        "#4682B4",  // Steel Blue
        "#4169E1",  // Royal Blue
        "#000080",  // Navy Blue
        "#001F3F",  // Dark Navy Blue
      ]);
  } else if (indicator === "NE.IMP.GNFS.ZS") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200, maxIndicatorValue])
      .range([
        "#FFEDA0",  // Lightest Yellow
        "#FED976",  // Light Yellow
        "#FEB24C",  // Medium Yellow
        "#FDAE61",  // Darker Yellow
        "#FD8D3C",  // Dark Orange
        "#E31A1C",  // Red-Orange
        "#BD0026",  // Dark Red
        "#800026",  // Darker Red
        "#550019",  // Very Dark Red
        "#33000D",  // Almost Black
        "#1A0006",  // Very Dark Gray
        "#000000"   // Black
      ]);
    } else if (indicator === "FP.CPI.TOTL.ZG") {
      return d3
        .scaleLinear()
        .domain([minIndicatorValue, -10, -5, 0, 5, 10, 20, 50, 100, 200, maxIndicatorValue])
        .range([
          "##4575b4",  // Black (min value)
          "#91bfdb",  // Light Blue (-10)
          "#d73027",  // Dark Orange (-5)
          "#fee08b",  // Light Yellow (0)
          "#fdae61",  // Orange (5)
          "#d7191c",  // Dark Red (10)
          "#a50f15",  // Darker Red (20)
          "#d9ef8b",  // Light Yellow (50)
          "#d73027",  // Dark Orange (100)
          "#595959",  // Gray (200)
          "##4575b4",  // Black(max value)
        ]);
    
  } else if (indicator === "MS.MIL.XPND.GD.ZS") {
    return d3
    .scaleLinear()
    .domain([minIndicatorValue, .5, 10, 15, 20, 25, 30, maxIndicatorValue])
    .range([
        "#FFE4B5",  // Moccasin
        "#CD853F",  // Peru
        "#8B4513",  // Saddle Brown
        "#A52A2A",  // Brown
        "#8B0000",  // Dark Red
        "#800000",  // Maroon
        "#2E1D16",  // Indigo
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

  // console.log(minIndicatorValue);

  // return indicatorValue >= 2000000000
  //   ? "#800026" // Red for populations greater than or equal to 2 billion
  //   : indicatorValue >= 1000000000
  //   ? "#BD0026" // Dark red for populations greater than or equal to 1 billion
  //   : indicatorValue >= 500000000
  //   ? "#E31A1C" // Orange-red for populations greater than or equal to 500 million
  //   : indicatorValue >= 200000000
  //   ? "#FC4E2A" // Orange for populations greater than or equal to 200 million
  //   : indicatorValue >= 100000000
  //   ? "#FD8D3C" // Dark orange for populations greater than or equal to 100 million
  //   : indicatorValue >= 50000000
  //   ? "#FEB24C" // Yellow for populations greater than or equal to 50 million
  //   : indicatorValue >= 20000000
  //   ? "#FED976" // Light yellow for populations greater than or equal to 20 million
  //   : "#FFEDA0"; // Pale yellow for populations less than 20 million
}

// Function to style the GeoJSON features
function style(feature) {
  let selectedIndicator = getSelectedIndicator();
  const indicator = getIndicatorValue(
    feature.id,
    indicatorData,
    selectedIndicator,
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
  create_donut_chart(selectedCountry, selectedDatayear)
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
    selectedDatayear = d3.select("#selDatayear").property("value");
    // selectedDataindicator = d3.select("#selDataindicator").property("value");
    selectedDataindictorName = d3
      .select("#selDataindicator option:checked")
      .text();

    // console.log(selectedDataindicator);
    // console.log(indicator[0].series_code);
    await choropleth(year[0], indicator[0].series_code);
    if (wholeData) {
      // console.log(year);
      create_bar(selectedDataindictorName, selectedDatayear);
      linechart("USA", selectedDataindictorName);
      scatterplot(selectedDataindictorName, selectedDatayear);
      create_donut_chart("USA", selectedDatayear);
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

  // console.log(selectedDataindictorName);

  await choropleth(selectedDatayear, selectedDataindicator);
  create_bar(selectedDataindictorName, selectedDatayear);
  linechart("USA", selectedDataindictorName);
  scatterplot(selectedDataindictorName, selectedDatayear);
  create_donut_chart("USA", selectedDatayear);
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
// function sortDescending(a, b) {
//   return b[1] - a[1];
// }
function sortDescending(a, b) {
  return b.indicator_value - a.indicator_value;
}

// let barSortAscending = indicatorData.sort((a,b) => a.indicator_value - b.indicator_value)
// console.log(barSortAscending)

function create_bar(selectedSeries, selectedYear) {
  // select only the top 10 countries
  let sortedData = indicatorData
    .sort((a, b) => b.indicator_value - a.indicator_value)
    .slice(0, 10);
  // console.log(barSortAscending)
  // let sortedData = indicatorData.sort(sortDescending).slice(0, 10);
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
      text: indicator_val
    },
  };
  // create the layout
  let barLayout = {
    // make the title auto-update depending on the selected year and series

    title: {
      text: "Top 10 " + selectedSeries,
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
        text: selectedSeries,
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

// #######################################################
function linechartData() {
  return new Promise((resolve, reject) => {
    let chartData; // Declare chartData within the scope of the promise

    d3.json(`/api/data`)
      .then((data) => {
        chartData = data;
        // console.log("chart data",chartData); // Move inside the 'then' block to log after data is fetched
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
    animation: false,
    plugins: {
      title: {
        display: true, // enables the title
        text: selectedDataindictorName, // the title text
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
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Years'
        }
      },


      y: {
        grid: {
          display: false
        },
        title: {
          display: true,
          text: selectedDataindictorName
        }
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
// ############################################################
// create Charts.JS Scatter Plot

async function scatterplot(selectedDataindicator, selectedDatayear) {
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
  let ybubble = filtered_data
    .filter((data) => data.series_name == selectedDataindicator)
    .map((data) => data.indicator_value);
  let xbubble = filtered_data
    .filter((data) => data.series_name == "GDP growth (annual %)")
    .map((data) => data.indicator_value);
  let sortedx = xbubble.sort(sortDescending).slice(0, 50);
  let sortedy = ybubble.sort(sortDescending).slice(0, 50);

  let scatterData = filtered_data.map((d, i) => ({
    x: sortedx[i],
    y: sortedy[i],
    country: d.country_name,

  }));


  console.log("scatter", scatterData);
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
          // hovertemplate: "Country: <%= dataset.data[i].country%>",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
          responsive: true,
          maintainAspectRatio: false, // This might be used instead of aspectRatio
          // height: 800,
          // width: 300,
        },
        title: {
          display: true, // enables the title
          text:
            "Top 30: GDP growth (annual %) vs." +
            " " +
            selectedDataindicator +
            " in " +
            selectedDatayear, // the title text
          font: {
            // the title font
            size: 15,
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
scatterplot(selectedDatayear, selectedDataindictorName);
// ############################################################

function getDonutchartData() {
  return new Promise((resolve, reject) => {
    let donutChartData; // Declare chartData within the scope of the promise

    d3.json(`/api/data/GDPdata`)
      .then((data) => {
        donutChartData = data;
        resolve(donutChartData);
      })

      .catch((error) => {
        console.error("Error fetching data", error);
        reject(error)
      }).finally(() => {
        console.log('resolution')
      }
      );

  });

}


async function create_donut_chart(selectedCountry, selectedDatayear) {

  let donutChartData = await getDonutchartData();
  let donutFilter = donutChartData.filter((data) => data.country_code == selectedCountry && data.years == selectedDatayear)
  console.log("donut filter", donutFilter);
  if (donutFilter.length === 0) {
    console.log("no data found")
  }
  let donut_data = {
    labels: donutFilter.map((data) => data.series_name),
    datasets: [
      {
        data: donutFilter.map((data) => data.indicator_value),
        order: 1

      }
    ]
  };

  let donutOptions = {
    animation: true,
    scale: {
      ticks: {
        fontSize: 10, // Set font size for scale ticks
      },
    },
    borderAlign: 'inner',
    plugins: {
      legend: true,
      labels: {
        fontColor: 'black',
        fontSize: 7,

      },
      fontColor: 'black',
      title: {
        display: true, // enables the title
        text: "Polar Area Chart for " + selectedCountry + ' in ' + selectedDatayear, // the title text
        font: { // the title font
          size: 15
        },

      }

    }


  };

  const existingdonutChart = Chart.getChart(document.getElementById("donutchart"))
  if (existingdonutChart) {
    existingdonutChart.destroy();
  }
  // create variable to get the element in the HTML file
  let ctx = document.getElementById("donutchart").getContext("2d");


  let mydonutChart = new Chart(ctx, {
    type: "polarArea",
    data: donut_data,
    options: donutOptions

  });
}



// create_donut_chart("ARG",2018)




// ###############################################################
document.addEventListener("DOMContentLoaded", function () {
  init();
});
