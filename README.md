<img width="1591" alt="image" src="https://github.com/AlyssaCullinan/project3-world-indicators/assets/141466633/a7436647-44c3-4cc1-af78-5da2882dfbb3">

## Description
We created an interactive dashboard to explore data from the official World Bank website. We were interested in telling a story through our visualization dashboard to show various attributes within a single webpage.


Our world has gone through drastic changes especially in the past few years with the pandemic, war, rising inflation, and population trends. We were interested in seeing the global data visualized over the past 20 years.


## Table of Contents 

- [Features](#Features)
- [Dashboard](#Dashboard)
- [Folder Structure](#Folder-Structure)
- [Dashboard Workflow](#Dashboard-Workflow)
- [Built With](#Built-With)
- [Running the Application](#Running-the-Application)
- [Data Sources](#Data-Sources)
- [Credits](#Credits)


## Features
 * Two dropdown menus allow users to select the year and indicator name which updates the map and charts.
 
* Choropleth map
    * When users hover over a country on the map, the line chart and polar area chart update with data for that country.
* Line chart 
    * Updates when users hover over a country on the map. Displays time series data for the  selected country and indicator.
* Bar chart
    * Displays the top ten countries for the selected indicator and year. 
* Scatter plot
    * Updates based on year and indicator selected from the dropdown.
    * Has a fixed Y axis variable GDP Growth (annual %).
* Polar Area chart
    * Updates when users hover over a country on the map. Displays for indicators with "% of GDP" data for that country.


## Dashboard

![Screenshot 2024-03-09 144118](https://github.com/AlyssaCullinan/project3-world-data-dashboard/assets/141466633/7492ffbd-6747-4007-9738-1575adeab5bf)

## Folder Structure

* docs
* python
    * data_cleaning.ipynb
    * config.py
* static
    * css
        * styles.css
    * data
        * final_data.csv
    * images
    * js
        * bar_chart.js
        * leaflet-heat.js
        * line_chart.js
        * main.js
        * map.js
        * polarArea_chart.js
        * scatter_plot.js
* templates
    * index.html
* app.py


## Dashboard Workflow

![image](https://github.com/AlyssaCullinan/project3-world-indicators/assets/141466633/64f40c8d-0c41-4f70-86d6-7135ace318bc)


## Built With

*	Python 
*	Jupyter Notebook 
*	Conda 
*	PostgreSQL
*	Flask
*	HTML
*	JavaScript
*	SQLAlchemy
*	D3 Library https://d3js.org/d3.v7.min.js
*	Plotly https://cdn.plot.ly/plotly-latest.min.js
*	Leaflet library https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
*	Chart.js https://www.chartjs.org/
*	Python Modules
    *	Pandas 


## Running The Application
* Copy the repo and clone it onto your machine.
* Create a postgres database on your local machine. Use the schema.sql file to create the table structure.
* Create a config.py and enter your postgres username, password, database name, and connection port. 
* Run the app.py file

## Data Sources
* World Bank World Development Indicators (2003-2022) 

    https://databank.worldbank.org/source/world-development-indicators
 * Country Polygons as GeoJSON

    https://datahub.io/core/geo-countries
       

## Credits
Team: Alyssa Cullinan, Shubhangi Bidkar
