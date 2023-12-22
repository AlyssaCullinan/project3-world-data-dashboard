-- Drop the table if it exists
DROP TABLE IF EXISTS world_bank_indicators;

-- Create the new table
CREATE TABLE world_bank_indicators (
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(50),
    country_code VARCHAR(10),
    series_name VARCHAR(500),
    series_code VARCHAR(50),
    years INT,
    indicator_value DOUBLE PRECISION
);

SELECT * FROM world_bank_indicators;


-- Drop the table if it exists
DROP TABLE IF EXISTS lat_long_info;

-- Create the new table
CREATE TABLE lat_long_info (
    ID SERIAL PRIMARY KEY,
    country_name VARCHAR(50),
    lat FLOAT,
    lng FLOAT
);

SELECT * FROM lat_long_info;

