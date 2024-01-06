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

  if (indicator === "GC.DOD.TOTL.GD.ZS") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 50, 60, 70, 80, 90, maxIndicatorValue])
      .range([
        " #f7fcb9",
        "#addd8e",
        "#78c679",
        "#41ab5d",
        "#238443",
        "#006837",
        "#004529",
      ]);
  } else if (indicator === "NE.EXP.GNFS.ZS") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 20, 30, 40, 50, 60, 80, maxIndicatorValue])
      .range([
        "#fdae61",
        "#fee08b",
        "#d73027",
        "#4575b4",
        "#91bfdb",
        "#313695",
        "#a50026",
        "#313695",
      ]);
  } else if (indicator === "NY.GDP.MKTP.KD.ZG") {
    return d3
      .scaleLinear()
      .domain([minIndicatorValue, 2, 3, 4, 5, 6, 7, maxIndicatorValue])
      .range([
        "#FFEDA0", // Pale yellow for populations less than 20 million
        "#FED976", // Light yellow for populations greater than or equal to 20 million
        "#FEB24C", // Yellow for populations greater than or equal to 50 million
        "#E31A1C", // Light orange for populations greater than or equal to 100 million
        "#FC4E2A", // Orange for populations greater than or equal to 200 million
        "#FD8D3C", // Dark orange for populations greater than or equal to 500 million
        "#B2D732", // Light green for populations greater than or equal to 1 billion
        "#6ECC19",
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
    } else {
      console.error("Error initializing: wholeData is undefined");
    }
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

export { init };
