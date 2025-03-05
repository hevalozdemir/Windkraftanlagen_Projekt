CREATE OR REPLACE VIEW leistung_nabenhoehe_avg AS (
  SELECT
    WIDTH_BUCKET(nabenhoehe, 0, 100, 10) AS nabenhoehe_group,
    AVG (leistung) AS avg_leistung
  FROM windtabelle
  WHERE leistung IS NOT NULL AND nabenhoehe IS NOT NULL
  GROUP BY nabenhoehe_group
  ORDER BY nabenhoehe_group

);

CREATE OR REPLACE VIEW leistung_rotordurchmesser_avg AS (
    SELECT
        WIDTH_BUCKET(rotordurchmesser, 0, 150, 10) AS  rotordurchmesser_group,
        AVG(leistung) AS avg_leistung
    FROM windtabelle
    WHERE leistung IS NOT NULL AND rotordurchmesser IS NOT NULL
    GROUP BY rotordurchmesser_group
    ORDER BY rotordurchmesser_group
);

DROP VIEW IF EXISTS wind_data_groupped;

CREATE OR REPLACE VIEW wind_data_groupped AS
SELECT
    wind_direction_group,
    COUNT(*) AS total_count,

    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 0.0 AND 1.0 THEN 1 END) * 100.0 / COUNT(*),2) AS val1,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 1.0 AND 2.0 THEN 1 END) * 100.0 / COUNT(*),2) AS val2,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 2.0 AND 3.0 THEN 1 END) * 100.0 / COUNT(*),2) AS val3,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 3.0 AND 4.0 THEN 1 END) * 100.0 / COUNT(*),2) AS val4,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 4.0 AND 12.0 THEN 1 END) * 100.0 / COUNT(*),2) AS val5,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 12.0 AND 20.0 THEN 1 END) * 100.0 / COUNT(*),2) AS val6,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 20.0 AND 28.0 THEN 1 END) * 100.0 / COUNT(*),2 )AS val7,
    ROUND(COUNT(CASE WHEN wind_speed BETWEEN 28.0 AND 36.0 THEN 1 END) * 100.0 / COUNT(*),2 )AS val8
FROM (
    SELECT
       CASE
        WHEN wind_direction = 0 THEN 'N'
        WHEN wind_direction < 45 THEN 'NNE'
        WHEN wind_direction = 45 THEN 'NE'
        WHEN wind_direction < 90 THEN 'ENE'
        WHEN wind_direction = 90 THEN 'E'
        WHEN wind_direction < 125 THEN 'ESE'
        WHEN wind_direction = 125 THEN 'SE'
        WHEN wind_direction < 180 THEN 'SSE'
        WHEN wind_direction = 180 THEN 'S'
        WHEN wind_direction < 225 THEN 'SSW'
        WHEN wind_direction = 225 THEN 'SW'
        WHEN wind_direction < 270 THEN 'WSW'
        WHEN wind_direction = 270 THEN 'W'
        WHEN wind_direction < 315 THEN 'WNW'
        WHEN wind_direction = 315 THEN 'NW'
        ELSE 'NNW'
      END AS wind_direction_group,
      wind_speed
    FROM windhisttabelle
  ) AS subquery
GROUP BY wind_direction_group;


