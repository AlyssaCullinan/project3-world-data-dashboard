// initialize variables
let data;
// create empty array to hold the data from the API
let series_indicator = [];
// variable to hold the series and year when selected from the dropdown
let selectedSeries;
let selectedYear;
// create set for country dropdown 
let countryDropdownList = new Set();
// create set for series name dropdown
// let seriesNameDropdownList = new Set();
// create set for year name dropdown
// let yearDropdownList = new Set();
// create variable to select the dropdown element on the webpage 
// let seriesNameDropdown = d3.select("#selseries");
// create variable to select the dropdown element on the webpage 
let countryDropdown = d3.select("#selDataset");
// let yearDropdown = d3.select("#selDataset"); 

// let filtered_data;
let filtered_data3;
let GDP_values = [];
// create data promise
d3.json("/api/data").then(
    (data) => {
        console.log(data); 
        // create a list with the series indicator data
        data.forEach((d)=> {
        series_indicator.push([d.series_name, d.indicator_value, d.years, d.country_name]);
        // add the names of the countries to the dropdown
        if(!countryDropdownList.has(d.country_name))
            {countryDropdownList.add(d.country_name)
            countryDropdown.append("option").text(d.country_name).property("value",d.country_name)};
    });
    // create dropdown for Year and Series Name **need help from Erin with fixing this code
        //     let seriesName = String(d.series_name);
        // if(!seriesNameDropdownList.has(seriesName))
        //     {seriesNameDropdown.append("option").text(seriesName).property("value", seriesName)};
        // });

        // yearList.forEach((year) => {if(!yearList.has(year)){yearList.add(year)
        //     yearDropdown.append("option").text(year).property("value", year);
        // }});
// });


    // // create an empty dictionary to hold the data values
    // let dataDict =  {} 
    // // loop over the country codes
    // let country_codes = [...new Set(data.map(d =>d.country_code))];
    // country_codes.forEach(country_code =>{
    // // filter the data
    // let country_data = data.filter(d => d.country_code === country_code);
    // //get the country name from the first element of the filtered list
    // let country_name = country_data[0].country_name;
    // // initialize an empty object for the current country
    // dataDict[country_code] = {country_name: country_name};
    // // loop over the years
    // let years = [...new Set(country_data.map(d => d.years))];
    // years.forEach(year => {
    //     let year_data = country_data.filter(d => d.years === year);
    //     let year_obj = year_data.reduce((obj,d)=>{
    //         obj[d.series_name] = d.indicator_value;
    //         return obj;
    //     },

    //     {
    //     });
    //     // assign the year_obj to the data_dict
    //     dataDict[country_code][year] = year_obj;
    //     // console.log("dataDict", dataDict)

    // // });

    // });




// create functions to sort the data
function sortDescending(a,b){
    return    b[1] - a[1];
};
function sortAscending(a,b){
    return     a[1] - b[1];
};



// create plotly bar chart
// create a function to create a bar chart with parameters for the year and series which will be selected from a dropdown
function create_bar(selectedSeries, selectedYear){
    // create a filter for the selected series
    let filtered_data  = series_indicator.filter(d => d[0] === selectedSeries && d[2]=== selectedYear);
    // select only the top 10 countries
    let sortedData = filtered_data.sort(sortDescending).slice(0,10);
    // create a variable for the  series indicator value and a variable for the country 
    console.log(sortedData)
    let indicator_val = sortedData.map(d => d[1]);
    let country = sortedData.map(d=> d[3]);
    // create the trace object
    let trace = {
        x: country,
        y: indicator_val,
        type: 'bar',
        // orientation: 'h',
        marker: {
            color: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', 'brown']}
    };
    // create the layout
    let barLayout = {
        // make the title auto-update depending on the selected year and series
        title: 'The Top 10: Bar Chart of ' + selectedSeries + ' '+ 'in ' + selectedYear,
        width: 900,
        xaxis: {
            // add the range slider to the bottom of the graph
            title: "Country Name",
             // sort the bar chart in ascending order
            categoryorder:'total ascending'
            // rangeselector: {
            //     buttons: [
            //         {count: 1, label: '1y', step: 'year', stepmode: 'backward'},{step: 'all'}
            //     ]
            // },
            // rangeslider:{},
            // autorange:true,
        },
        yaxis:{
            title: selectedSeries
        }
    };

    let top10BarData = [trace];
    Plotly.newPlot("plotly", top10BarData, barLayout)
};

// call bar chart function - later replace parameters with variable for year and series indicator drop downs
create_bar("Military expenditure (% of GDP)", 2021);




// create ChartsJS chart
let filtered_chartjs = series_indicator.filter(d => d[0] === "Unemployment, total (% of total labor force) (national estimate)" && d[2] === 2022);
let sortedjs = filtered_chartjs.sort(sortAscending).slice(0,10);
// map the indicator value from the sliced data
let indicator_valjs = sortedjs.map(d => d[1]);
let countryjs = sortedjs.map(d=> d[3]);
    // console.log("indicator val", countryjs)
    // console.log("sorted",sortedjs)
// create the data trace for the bar chart data
let chartjsBarChartData = {
    labels: countryjs,
    datasets: [
        {   
            data: indicator_valjs,
            backgroundColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', '##EBDC78'],
            borderColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', '#EBDC78'],
            borderWidth: 3,
            order: 1

        }
        // if you want to add another trace, add it here
    ]
};

// filter the data for the multi-line chart
let linechartfilterZimbabwe = series_indicator.filter(d=> d[0]==="Inflation, consumer prices (annual %)" && d[3]== 'Zimbabwe' )
let linechartfilterSudan = series_indicator.filter(d=> d[0]==="Inflation, consumer prices (annual %)" && d[3]== 'Sudan' )
let linechartfilterSouthSudan = series_indicator.filter(d=> d[0]==="Inflation, consumer prices (annual %)" && d[3]== 'South Sudan' )
let linechartfilterLebanon = series_indicator.filter(d=> d[0]==="Inflation, consumer prices (annual %)" && d[3]== 'Lebanon' )


// create variables to map the data
let sudanLine = linechartfilterSudan.map(d=>d[1])
let southsudanLine = linechartfilterSouthSudan.map(d=>d[1])
let lebanonLine = linechartfilterLebanon.map(d=>d[1])
let sortedlineZimbabwe = linechartfilterZimbabwe.map(d=>d[1])

// add the data to the datasets for the chart
let lineChartData = {
    labels: linechartfilterZimbabwe.map(d=> d[2]),
    datasets: [
        {
            label: 'Zimbabwe',
            data: sortedlineZimbabwe,
            // borderWidth: 1,
        },
        {
            label: 'Sudan',
            data: sudanLine,
            // borderWidth: 1,
    
        },
        {
            label: 'South Sudan',
            data: southsudanLine,
            // borderWidth: 1,

        },
        {
            label: 'Lebanon',
            data: lebanonLine,
            // borderWidth: 1,
            
        }
    ]
};

// create an object for the % of GDP data which will be used in donut chart *need help from Erin to fix code error here*
let donut_dict = data.reduce((obj,d)=>{
    if (d.series_name.includes("(% of GDP)")){
        // check to see if country is already in the object
        if (!obj[d.country_name]){
            // if it doesn't already exist, create a new empty object for it
            obj[d.country_name] = {}
        }

        if (!obj[d.country_name][d.years]){
  // store the series name, indicator value, and year
        obj[d.country_name][d.years] = Object.assign({}, obj[d.country_name][d.years]);
        }
        obj[d.country_name][d.years][d.series_name] = d.indicator_value;
        
    }
    return obj;
},

  {});
          
    
console.log(donut_dict);

// add the donut data to the dataset for the chart
let doughnut_data = {
    labels: Object.keys(donut_dict['Sudan'][2021]),
    datasets: [
        {
            data: Object.values(donut_dict['Sudan'][2021]),
            backgroundColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', 'brown'],
            borderColor: ['#FD7F6F', '#7EB0D5', '#B2E061', '#BD7EBE', '#FFB55A', '#FFEE65', '#BEB9DB', '#FDCCCE', '#8BD3C7', 'brown'],
            borderWidth: 3,
            order: 1

        }
    ]
};

// format the line chart title
let lineOptions = {
    // indexAxis: 'y',
    animation: false,
    plugins: {
        title: {
          display: true, // enables the title
          text: 'Countries with the Highest Inflation, Consumer Prices (Annual %)', // the title text
          font: { // the title font
            size: 20
          },
          color: 'black', // the title color
          padding: 10 // the title padding
        }
      },
    scales:{
        x:{
            // ticks:{
                // maxTicksLimit: 9
            }
        }

    }
// format the bar chart
let barOptions = {
    indexAxis: 'y',
    animation: false,
    plugins: {
        legend:{
            display:false
        },
        title: {
          display: true, // enables the title
          text: 'The Bottom 10: Countries from our Dataset with the Lowest Unemployment Rate (% of Total Workforce) in 2022', // the title text
          font: { // the title font
            size: 20
          },
          color: 'black', // the title color
          padding: 10 // the title padding
        }
      },
    scales:{
        x:{
            ticks:{
                maxTicksLimit: 9
            }
        }

    }
};


let donutOptions = {
    animation: true,
    plugins: {
        title: {
          display: true, // enables the title
          text: '% of GDP Distribution for Sudan in 2021', // the title text
          font: { // the title font
            size: 20
          },
          color: 'black', // the title color
          padding: 10 // the title padding
        }
      }
};


// create variable to get the element in the HTML file
let ctx = document.getElementById("myChart").getContext("2d");
let ctx2 = document.getElementById("lineChart").getContext("2d");
let ctx3 = document.getElementById("doughnutChart").getContext("2d");

// create the barchart, donut, and line chart
let myChart = new Chart (ctx, {
    type: "bar",
    data: chartjsBarChartData,
    options: barOptions

});

let mylineChart = new Chart (ctx2,{
    type:"line",
    data: lineChartData,
    options: lineOptions
});

let mydoughnutChart = new Chart (ctx3, {
    type: "doughnut",
    data: doughnut_data,
    options: donutOptions

});

// create the Plotly bubble chart 
function create_bubble(xSeries, ySeries, selectedYear){
    // filter data for x series or y series and the selected year
    let filtered_data = series_indicator.filter(d => (d[0] == xSeries || d[0] == ySeries) && d[2] == selectedYear);
    let xValues = filtered_data.filter(d => d[0] == xSeries).map(d=> d[1]);
    // console.log(xValues.length);
    let yValues = filtered_data.filter(d => d[0] == ySeries).map(d=> d[1]);
    // console.log(yValues.length);
    // slice top 30 countries
    let sorted = filtered_data.sort(sortDescending).slice(0,30);
    let indicator_val = sorted.map(d => d[1]);
    let year = sorted.map(d => d[2])
    // format the markers
    let desired_max_marker_size = 40;
    let sizeref = 2.0 * Math.max(...indicator_val)/(desired_max_marker_size**2);
    let trace3 = {
        x: xValues,
        y: yValues,
        text: sorted.map(d => d[3]),
        mode: 'markers',
        marker:{
            size: indicator_val,
            sizeref: sizeref,
            sizemode:'area',
            color: indicator_val,
            colorscale:'Viridis',
        }
    
    };
    let layout = {
        showlegend: false,
        height: 800,
        width: 800,
        title:'Bubble Plot of' +' '+ xSeries +' '+ 'vs.' + ' '+ ySeries +' ' + 'in' +' ' + selectedYear,
        xaxis:{
            title: xSeries,
            autorange: false,
            range:[0,18,1]

        },
        yaxis:{
            title: ySeries,
            autorange: false,
            range:[0,4,1]
        }
    };
    let data3 = [trace3];

    Plotly.newPlot("scatterplot", data3, layout);
    

};

// call the bubble chart function
create_bubble("GDP growth (annual %)","Population growth (annual %)", 2022);


// filter data for ChartsJS scatterplot
let filtered_data = series_indicator.filter(d => (d[0] == "Military expenditure (% of GDP)" || d[0] == "Imports of goods and services (% of GDP)") && d[2] == 2020);
let scatterplot2 = document.getElementById("scatterplot2").getContext("2d");

// let sizerefbubble = 2.0 * Math.max(...filtered_data3.map(d => d[4]))/(40**2)
let xbubble = filtered_data.filter(d => (d[0] == "Military expenditure (% of GDP)")).map(d=>d[1]);
let ybubble = filtered_data.filter(d => (d[0] == "Imports of goods and services (% of GDP)")).map(d=>d[1]);
// let sortedx = xbubble.sort(compareIndicatorValue).slice(0,10);
// let sortedy = ybubble.sort(compareIndicatorValue).slice(0,10);
let data6 = filtered_data.map((d,i)=>({
    x:xbubble[i],
    y:ybubble[i],
    // r: ,
    // sizeref: sizerefbubble,
    // sizemode: 'area'

}));

// console.log("data6", filtered_data3)
let config2 = new Chart (scatterplot2, {
    type: "bubble",
    data:{
        datasets: [
            {
                label: selectedYear,
                data: data6,
                borderWidth: 2,
                showLine: true,
                hovertemplate: 'Country: %{customdata} <br>Military expenditure: %{x}% <br>Imports of goods and services: %{y}%',
                customdata: filtered_data.map(d => d[3]) // country name
            }
        ]
    },
    options:{
        plugins:{
            legend:{
                display:false
            }
        },
        aspectRatio: 1,
        
    scales:{
        x:{
            title:{
                display: true,
                text: "Military expenditure (% of GDP)"
            },
            autorange: true,
            ticks:{
                stepSize:1
            }
        },
        y: {
            title:{
                display: true,
                text: "Imports of goods and services (% of GDP)"
            },
           autorange: true,
            ticks:{
                stepSize:1
            }
        }
        }
    },
    }

);
// render the scatterplot chart
config2.render()

});




























































 