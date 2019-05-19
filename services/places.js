const db = require('./db');
<<<<<<< HEAD
const axios = require('axios')l;
const moment = require('moment');
const PlaceService = {};
module.exports = PlaceService;

PlaceService.createPlace = (business_name, categ, sub_categ, addr, city, state, zip, lat, long, stars, review_count, hours, img_url) => {
	const sql = `INSERT INTO places (business_name, categ, sub_categ, addr, city, state, zip, lat, ling, stars, review_count, hours, img_url)
		VALUES ($[business_name], $[categ], $[sub_categ], $[addr], $[city], $[state], $[zip], $[lat], $[long], $[stars], $[review_count], $[hours], $[img_url])`	
	return dn.none(sql, {business_name, categ, sub_categ, addr, city, state, zip, lat, long, stars, review_count, hours, img_url})
};

PlaceService.readPlaceInRadius = (max_lat, min_lat, max_long, min_long) => {
	const now = moment(Date.now()).format('YYYY-MM-DD')+'T'+moment(Date.now()).format('HH')+'00:00';
	const end = moment(Date.now()).format('YYYY-MM-DD')+'T23:59:59';
	return db.any('SELECT * FROM events WHERE lat > $[min_lat] AND lat < $[max_lat] AND long > $[min_long] AND long < $[max_long] AND hours BETWEEN $[now] AND $[end]', { max_lat, min_lat, max_long, min_long, now, end });
=======
const axios = require('axios');
const moment = require('moment');
const PlaceService = {};

PlaceService.createPlace = (business_name, categ, sub_categ, addr, city, state, zip, lat, long, stars, review_count, hours, img_url) => {
	const sql = `INSERT INTO places (business_name, categ, sub_categ, addr, city, state, zip, lat, ling, stars, review_count, hours, img_url)
		VALUES ($[business_name], $[categ], $[sub_categ], $[addr], $[city], $[state], $[zip], $[lat], $[long], $[stars], $[review_count], $[hours], $[img_url])`
	return dn.none(sql, { business_name, categ, sub_categ, addr, city, state, zip, lat, long, stars, review_count, hours, img_url })
};

PlaceService.readPlaceInRadius = (max_lat, min_lat, max_long, min_long) => {
	const max_lat = parseInt(lat) + 0.00725, min_lat = parseInt(lat) - 0.00725;
  const max_long = parseInt(long) + 0.00725, min_long = parseInt(long) - 0.00725;
	return db.any('SELECT * FROM places WHERE lat > $[min_lat] AND lat < $[max_lat] AND long > $[min_long] AND long < $[max_long]', { max_lat, min_lat, max_long, min_long });
>>>>>>> master
};

PlaceService.readYelpAPI = () => {
	// put in yelp api
};

PlaceService.deletePlace = () => {
	return db.none(`DROP TABLE IF EXISTS places
			CREATE TABLE places (
<<<<<<< HEAD
			id SERIAL PRIMARY KEY,
			business_name VARCHAR NOT NULL,
=======
				id SERIAL PRIMARY KEY,
				business_name VARCHAR NOT NULL,
>>>>>>> master
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
  			img_url VARCHAR)`)
};
<<<<<<< HEAD
=======

module.exports = PlaceService;
>>>>>>> master
