# Web API module
from flask import Flask, jsonify, render_template
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
from config import PGUID, PGPASS, PGHOST, PGPORT, PGDB
from decimal import Decimal
import pandas as pd
#################################################
# Database Setup
#################################################
db_connection_string = f'postgresql://{PGUID}:{PGPASS}@{PGHOST}:{PGPORT}/{PGDB}'
print(db_connection_string)
# create engine to to database
engine = create_engine(db_connection_string)
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)
# print(Base.classes.keys())
#Test = Base.classes.test
WBIndicators = Base.classes.world_bank_indicators
Lat_lng_info = Base.classes.lat_long_info
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
# Create routes for the different data needed
@app.route("/")
def home():
    return render_template('index.html')

@app.route('/api/data')
def world_data():
    session = Session(engine)
    # Query the world bank info table and pull all the data
    results = session.query(WBIndicators.country_name,WBIndicators.country_code,WBIndicators.series_name,WBIndicators.series_code,WBIndicators.years,WBIndicators.indicator_value).all()
    result_df= pd.DataFrame(results)
    session.close()
    return result_df.to_json(orient ="records")

@app.route("/api/data/<series>")
def filter_series(series):
    session = Session(engine)
    #filter series
    series = session.query(WBIndicators.country_name,WBIndicators.country_code,WBIndicators.series_name,WBIndicators.series_code,WBIndicators.years,WBIndicators.indicator_value).filter(WBIndicators.series_code == series)
    series_result_df = pd.DataFrame(series)
    session.close()
    return series_result_df.to_json(orient ="records")

# @app.route("/api/data/<country_code>")
# def filter_country(country_code):
#     session = Session(engine)
#     #filter series
#     country_code = session.query(WBIndicators.country_name,WBIndicators.country_code,WBIndicators.series_name,WBIndicators.series_code,WBIndicators.years,WBIndicators.indicator_value).filter(WBIndicators.country_code == country_code)
#     country_code_result_df = pd.DataFrame(country_code)
#     session.close()
#     return country_code_result_df.to_json(orient ="records")

if __name__ == "__main__":
    app.run(debug=True)