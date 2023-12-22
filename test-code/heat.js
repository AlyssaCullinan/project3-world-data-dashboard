document.addEventListener("DOMContentLoaded", function () {
  console.log("Inside heat");

  let myMap = L.map("map", {
    center: [39.8282, -98.5795],
    zoom: 7,
  });

  // let myMap = L.map("map", {
  //   center: [39.8282, -98.5795],
  //   zoom: 4,
  // });

  console.log("Inside 1heat");
  // Adding the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);

  d3.json("/api/data/heat/SP.POP.TOTL").then(function (response) {
    let heatArray = [];

    response.forEach((res) => {
      console.log(res.years);
      heatArray.push([res.lat, res.lng, res.indicator_value]);
    });
    console.log(heatArray);

    let heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 35,
    }).addTo(myMap);
  });
});
