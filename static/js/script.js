
let data;
let country_name = [];
let indicator_value = [];



d3.json("/api/data/NY.GDP.MKTP.CD").then((data) => {
    console.log(data);
    data.forEach((da) => {
        country_name.push(da.country_name);
        indicator_value.push(da.indicator_value);
    });
  

console.log("indicator_value",indicator_value)
function create_chart(){
let trace1 = {
    x: country_name,
    y: indicator_value,
    type: 'line',
    text: country_name
}

let data2 = [trace1];


Plotly.newPlot("plotly", data2)

};

create_chart()});









