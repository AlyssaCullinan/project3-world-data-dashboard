
let data;

// d3.json(url).then((data) =>{console.log(data)});

d3.json('/api/data').then(function(data){console.log(data)}).catch(function(error){console.log(error)})

let country_name = data.country_name;
let indicator_value = data.indicator_value;


// function create_chart()
// let trace1 = {
//     x: country_name,
//     y: indicator_value,
//     type: 'bar',
//     orientation: 'h',
//     text: indicator_value
// };




