let map;
let geojson;
let populationData;
let info;

// Function that fetches population for a given country code
function getPopulation(countryCode, data) {
  const countryData = data.find((entry) => entry.country_code === countryCode);
  return countryData ? countryData.indicator_value : 0;
}

// Function to add color based on population amount
function getColor(population) {
  return population >= 2000000000
    ? "#800026" // Red for populations greater than or equal to 2 billion
    : population >= 1000000000
    ? "#BD0026" // Dark red for populations greater than or equal to 1 billion
    : population >= 500000000
    ? "#E31A1C" // Orange-red for populations greater than or equal to 500 million
    : population >= 200000000
    ? "#FC4E2A" // Orange for populations greater than or equal to 200 million
    : population >= 100000000
    ? "#FD8D3C" // Dark orange for populations greater than or equal to 100 million
    : population >= 50000000
    ? "#FEB24C" // Yellow for populations greater than or equal to 50 million
    : population >= 20000000
    ? "#FED976" // Light yellow for populations greater than or equal to 20 million
    : "#FFEDA0"; // Pale yellow for populations less than 20 million
}

// Function to style the GeoJSON features
function style(feature) {
  const population = getPopulation(feature.id, populationData);
  return {
    fillColor: getColor(population),
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

  const population = getPopulation(layer.feature.id, populationData);
  const popupContent =
    "<b>" +
    layer.feature.properties.name +
    "</b><br/>" +
    (population ? formatPopulation(population) : "No data available");

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
function choropleth() {
  // Reset existing style layer before applying a new one
  if (geojson) {
    map.removeLayer(geojson);
  }

  d3.json(`/api/data/choropleth/SP.POP.TOTL/2022`).then((data) => {
    populationData = data;
    d3.json(`/api/v2.0/choropleth/geo`).then(function (geoData) {
      geojson = L.geoJson(geoData, {
        style: style,
        onEachFeature: onEachFeature,
      }).addTo(map);
    });
  });

  // Remove legend control if exists
  if (info instanceof L.Control) {
    map.removeControl(info);
  }

  info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
    this.update();
    return this._div;
  };

  //   info.update = function (props) {
  //     this._div.innerHTML = props
  //       ? "<b>" +
  //         props.properties.name +
  //         "</b><br/>" +
  //         ((population = getPopulation(props.id, populationData))
  //           ? formatPopulation(population)
  //           : "No data available")
  //       : "Hover over a country";
  //   };

  info.addTo(map);
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

// Function to initialize the choropleth
function init() {
  // Add base layer
  map = L.map("map", {
    center: [17.5707, -3.9932], // Initial center coordinates
    zoom: 2, // Initial zoom level
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

  choropleth();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});
