# Web API module
from flask import Flask, jsonify, render_template
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
from config import PGUID, PGPASS, PGHOST, PGPORT, PGDB
from decimal import Decimal
import simplejson as json
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
    """List API routes"""
    return render_template('index.html')

@app.route("/heat.html")
def heat():
    """List API routes"""
    return render_template('heat.html')


@app.route('/api/data')
def world_data():
    session = Session(engine)

    # Query the world bank info table and pull all the data
    results = session.query(WBIndicators.country_name,WBIndicators.country_code,WBIndicators.series_name,WBIndicators.series_code,WBIndicators.years,WBIndicators.indicator_value).all()
    # result_df= pd.DataFrame(results)

    session.close()
    # return result_df.to_json(orient ="records")
    all_data =[]
    for country_name,country_code,series_name,series_code,years,indicator_value in results:
        wb_dict ={}
        wb_dict["country_name"]:country_name
        wb_dict["country_code"]:country_code
        wb_dict["series_name"]:series_name
        wb_dict["years"]:years
        wb_dict["indicator_value"]:indicator_value

        all_data.append(wb_dict)

    return jsonify(all_data)

@app.route("/api/data/<series>")
def filter_series(series):
    session = Session(engine)
    #filter series
    series = session.query(WBIndicators.country_name,WBIndicators.country_code,WBIndicators.series_name,WBIndicators.series_code,WBIndicators.years,WBIndicators.indicator_value).filter(WBIndicators.series_code == series)
    series_result_df = pd.DataFrame(series)
    session.close()
    # return series_result_df.to_json(orient ="records")

    # Create a dictionary from the row data and append to a list of all data
    
    all_data =[]
    for country_name,country_code,series_name,series_code,years,indicator_value in series:
        wb_dict ={}
        wb_dict["country_name"]:country_name
        wb_dict["country_code"]:country_code
        wb_dict["series_name"]:series_name
        wb_dict["years"]:years
        wb_dict["indicator_value"]:indicator_value

        all_data.append(wb_dict)

    return jsonify(all_data)

    
    
@app.route("/api/data/heat/<series>")
def filter_series_lat_lng(series):

    session = Session(engine)

    #filter series
    series_lat_long = session.query(
        WBIndicators.country_name,
        WBIndicators.series_name,
        WBIndicators.series_code,
        WBIndicators.years,
        WBIndicators.indicator_value,
        Lat_lng_info.lat,
        Lat_lng_info.lng
    ).join(
        Lat_lng_info,
        WBIndicators.country_name == Lat_lng_info.country_name
    ).filter(
        WBIndicators.series_code == series,
        WBIndicators.years == 2022
    ).all()
    series_lat_long_df = pd.DataFrame(series_lat_long)


    session.close()
    return series_lat_long_df.to_json(orient ="records")

    # Create a dictionary from the row data and append to a list of all data
    
    # all_data =[]
    # for country_name,country_code,series_name,series_code,years,indicator_value,lat,lng in series_lat_long:
    #     wb_dict ={}
    #     wb_dict["country_name"]:country_name
    #     wb_dict["country_code"]:country_code
    #     wb_dict["series_name"]:series_name
    #     wb_dict["series_code"]:series_name
    #     wb_dict["years"]:years
    #     wb_dict["indicator_value"]:indicator_value
    #     wb_dict["lat"]:lat
    #     wb_dict['lng']:lng

    #     all_data.append(wb_dict)

    # return jsonify(all_data)




if __name__ == "__main__":
    app.run(debug=True)
