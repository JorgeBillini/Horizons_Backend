const db = require('./db');
const axios = require('axios');
const moment = require('moment');
const PlaceService = {};
module.exports = {PlaceService};

PlaceService.createPlace = (business_name, categ, sub_categ, addr, city, state, zip, lat, long, stars, review_count, hours, img_url) => {
	const sql = `INSERT INTO places (business_name, categ, sub_categ, addr, city, state, zip, lat, ling, stars, review_count, hours, img_url)
		VALUES ($[business_name], $[categ], $[sub_categ], $[addr], $[city], $[state], $[zip], $[lat], $[long], $[stars], $[review_count], $[hours], $[img_url])`
	return dn.none(sql, { business_name, categ, sub_categ, addr, city, state, zip, lat, long, stars, review_count, hours, img_url })
};

PlaceService.readPlaceInRadius = (min_lat, max_lat, min_long, max_long) => {
	return db.any('SELECT * FROM places WHERE lat > $[min_lat] AND lat < $[max_lat] AND long > $[min_long] AND long < $[max_long]', { max_lat, min_lat, max_long, min_long });
};

PlaceService.readYelpAPI = ( offset = 0 ) => {
	const url = `https://api.yelp.com/v3/businesses/search`
	const term = `?location=NYC&limit=50&offset=${offset}`
	const API_Key = `OO3Saz0hvxk-v0QFSvDyL79ElNRxg_BPX0A46BOqWVtdjYN_xRPa4vpvFuPwr6T-wZpzUNUM3uaL_FticZyIhVkKMwm3yFfDY_m7MQ-MxDI4lLQOeTDcaJjPwoXhXHYx`
	axios.get(`${url}${term}`,
	{headers: {Authorization: `Bearer ${API_Key}`}})
	.then(res=>{
		console.log(res.data.businesses)
		if(res.data.businesses.length > 1) PlaceService.readYelpAPI((offset+50))
	})
	.catch(console.log)
};

PlaceService.deletePlace = () => {
	return db.none(`DROP TABLE IF EXISTS places
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
  			img_url VARCHAR)`)
};

PlaceService.readYelpAPI()
