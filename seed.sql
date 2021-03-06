DROP DATABASE if exists horizons;
CREATE DATABASE horizons;

\c horizons

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  pic VARCHAR,
  interests TEXT [],
  events_attended VARCHAR,
  xp INT
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INT DEFAULT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  name_ VARCHAR NOT NULL,
  description_ VARCHAR,
  category VARCHAR,
  url_ VARCHAR, 
  starts TIMESTAMP NOT NULL,
  ends TIMESTAMP NOT NULL,
  price VARCHAR NOT NULL,
  logo VARCHAR,
  venue VARCHAR NOT NULL,
  lat NUMERIC,
  long NUMERIC,
  capacity INT
);

CREATE TABLE past_events (
  id SERIAL PRIMARY KEY,
  user_id INT,
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  name_ VARCHAR NOT NULL,
  description_ VARCHAR,
  category VARCHAR,
  url_ VARCHAR, 
  starts TIMESTAMP NOT NULL,
  ends TIMESTAMP NOT NULL,
  price VARCHAR NOT NULL,
  logo VARCHAR,
  venue VARCHAR NOT NULL,
  lat NUMERIC,
  long NUMERIC,
  capacity INT
);

CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  business_id VARCHAR NOT NULL,
  business_name VARCHAR UNIQUE NOT NULL,
  img_url VARCHAR,
  categories TEXT [],
  rating NUMERIC,
  lat NUMERIC NOT NULL,
  long NUMERIC NOT NULL,
  price VARCHAR,
  address_ VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state_ VARCHAR NOT NULL,
  zip VARCHAR NOT NULL,
  phone NUMERIC
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

INSERT INTO badges 
(badge_name, badge_description, badge_xp_value, badge_image)
VALUES
('Welcome to Horizons', 'User checked in to 1st event using Horizons app.', 50, 'need img url'),
('Alive & Well', 'User has checked in to 5+ events.', 50, 'need img url'),
('Intrepid Food Explorer', 'User has visited 5+ different restaurants.', 50, 'need img url'),
('Fit & Stronger', 'User has visited 5+ health or fitness events.', 50, 'need img url')
