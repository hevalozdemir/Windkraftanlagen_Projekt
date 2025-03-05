CREATE TABLE windhisttabelle (
    id BIGSERIAL PRIMARY KEY,
    wind_direction DECIMAL,
    wind_speed DECIMAL,
    wind_direction_10_min_avg DECIMAL,
    wind_speed_10_min_avg DECIMAL,
    wind_direction_10_min_gust DECIMAL,
    date_observed DATE
)