# World Data Statistics Dashboard 2003 - 2022

## Description
We created an interactive dashboard to explore data from the official World Bank website. We were interested in telling a story through our visualization dashboard to show various attributes within a single webpage.


Our world has gone through drastic changes especially in the past few years with the pandemic, war, rising inflation, and population trends. We were interested in seeing the global data visualized over the past 20 years.


## Table of Contents 

If your README is long, add a table of contents to make it easy for users to find what they need.

- [Features](#Features)
- [Folder Structure](#Folder)
- [Credits](#credits)
- [License](#license)


## Features

* Using SQL queries and python transformation to get the following global data by country code:
    * country name, country code, series name, series code, indicator value, years
* Using html, javascript, css, and flask, we created the following:
 * Two dropdown menus allow users to select the year and indicator name which updates the map and charts.
 
* Choropleth map
    * when users hover over a country on the map, the line chart and polar area chart update with data for that country.
* Line chart 
    * displays time series data for the selected country and indicator.
* Bar chart
    * displays the top ten countries for the selected indicator and year. 
* Scatter plot
    * Updates based on year and indicator selected from the dropdown.
    * has a fixed Y axis variable GDP Growth (annual %).


## Folder Structure

* Resources: Raw data downloaded as csvs and json file
    * FAO.csv
    * GlobalTemperatures.csv
    * countries.geojson
    * countries.csv
* Assets: Images used on the website
* database
    * etl:ipynb: used to develop etl process
    * database.py: sets up database when flask server is run
* static
* js
    * choropleth.js:
    * charts.js
    * bar_chart.js
* css
    * styles.css: styles index.html
* app.py: Flask server with two routes - index and data
* templates
    * index.html

## Built With


*	Python 
*	jupyter notebook 
*	conda 
*	PostgreSQL
*	flask
*	html
*	javascript
*	SQLAlchemy
*	D3 library https://d3js.org/d3.v7.min.js
*	Plotly https://cdn.plot.ly/plotly-latest.min.js
*	Leaflet library https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
*	Chart.js https://www.chartjs.org/
*	Python Modules
    *	pandas 


## Running The Application
* Copy the repo and clone it onto your machine.
* Create a postgres database on your local machine. Use the schema.sql file to create the table structure.
* Create a config.py and enter your postgres username, password, database name, and connection port. 
* Run the app.py file

## Data Sources

* World Bank World Development Indicators (2012-2022) 

    https://databank.worldbank.org/source/world-development-indicators

## Credits
Team: Alyssa Cullinan, Shubhangi Bidkar
