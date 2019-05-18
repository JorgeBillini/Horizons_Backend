DROP DATABASE if exists horizons;
CREATE DATABASE horizons;

\c horizons

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  pic VARCHAR,
  interests TEXT [],
  events_attended JSON,
  xp INT
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR NOT NULL,
  categ VARCHAR NOT NULL,
  sub_categ VARCHAR,
  desc_ JSON NOT NULL,
  url_ VARCHAR NOT NULL, 
  start_time JSON NOT NULL,
  end_time JSON NOT NULL,
  price VARCHAR NOT NULL,
  summary VARCHAR NOT NULL,
  organizer VARCHAR,
  logo VARCHAR,
  venue JSON,
  capacity INT
);

CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR NOT NULL,
  categ VARCHAR NOT NULL,
  sub_categ TEXT [],
  addr VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  zip VARCHAR NOT NULL,
  lat NUMERIC NOT NULL,
  long NUMERIC NOT NULL,
  stars NUMERIC,
  review_count INT,
  hours JSON,
  img_url VARCHAR
);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  badge_name VARCHAR NOT NULL,
  badge_description VARCHAR NOT NULL,
  badge_image VARCHAR NOT NULL
);

CREATE TABLE awards (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  badge_id INT NOT NULL,
    FOREIGN KEY (badge_id)
    REFERENCES badges(id)
    ON DELETE CASCADE,
  badge_xp_value INT NOT NULL,
  date_awarded TIMESTAMP DEFAULT NOW()
);

CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  user_one_id INT NOT NULL,
    FOREIGN KEY (user_one_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  user_two_id INT NOT NULL,
    FOREIGN KEY (user_two_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  is_accepted BOOLEAN DEFAULT FALSE
);