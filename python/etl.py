import os
from sqlalchemy import create_engine
import pandas as pd
from config import PGUID, PGPASS, PGHOST, PGPORT, PGDB  # Import database connection details




# Specify the path to the CSV file
csv_file_path = r'../static/data/final_data.csv'


# # Set the 'PGPASS' environment variable
os.environ['PGPASS'] = PGPASS
os.environ['PGUID'] = PGUID

# # Get PostgreSQL connection details from environment variables
uid = os.environ.get('PGUID')
pwd = os.environ.get('PGPASS')
server = PGHOST
port = PGPORT
db = PGDB

print(uid)
print(pwd)

def load_data_to_postgres(df, table_name):
    try:
        # Connect to PostgreSQL
        engine = create_engine(f'postgresql://{uid}:{pwd}@{server}:{port}/{db}')
        print('Inside load')

        # Define data types for each column (change 'your_column' to the actual column name)
       # Define data types for each column
        dtype_mapping = {
            'Country_Name': str,
            'Country_Code': str,
            'Series_Name':str,
            'Series_Code':str,
            'Year': int,
            'Value': float,
        }

        # Apply data types to the DataFrame
        df = df.astype(dtype_mapping)
        print(df)

        # Load DataFrame into PostgreSQL table
        df.to_sql(table_name, engine, if_exists='replace', index=False )
        engine.dispose()  # Commit changes and close the connection


        print(f'Data loaded successfully to PostgreSQL table: {table_name}')
    except Exception as e:
        print(f'Error loading data to PostgreSQL table: {table_name}\n{str(e)}')

def extract_data_from_csv(file_path):
    try:
        # Read CSV file into DataFrame with dtype parameter
        df = pd.read_csv(file_path)  # Adjust dtype based on your data
        print("Read data from csv file")

        return df
    except Exception as e:
        print(f'Error extracting data from CSV:\n{str(e)}')
        return None

if __name__ == "__main__":
    # Extract data from CSV file
    extracted_data = extract_data_from_csv(csv_file_path)

    if extracted_data is not None:
        # Specify the target table name in PostgreSQL
        postgres_table_name = 'test'

        # Load data into PostgreSQL
        load_data_to_postgres(extracted_data, postgres_table_name)
