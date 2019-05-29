DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS friends CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  pic VARCHAR,
  interests TEXT [],
  events_attended VARCHAR NOT NULL,
  xp VARCHAR DEFAULT '0'
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name_ VARCHAR NOT NULL,
  description_ VARCHAR,
  url_ VARCHAR NOT NULL, 
  starts TIMESTAMP NOT NULL,
  ends TIMESTAMP NOT NULL,
  price VARCHAR NOT NULL,
  logo VARCHAR,
  venue VARCHAR NOT NULL,
  lat VARCHAR ,
  long VARCHAR ,
  capacity INT NOT NULL
);

CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  business_name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  address_ VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state_ VARCHAR NOT NULL,
  zip VARCHAR NOT NULL,
  lat NUMERIC NOT NULL,
  long NUMERIC NOT NULL,
  stars NUMERIC,
  review_count INT,
  hours_ VARCHAR NOT NULL,
  img_url VARCHAR
);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  badge_name VARCHAR NOT NULL,
  badge_description VARCHAR NOT NULL,
  badge_xp_value INT NOT NULL,
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