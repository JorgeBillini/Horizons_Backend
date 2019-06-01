const db = require('./db');
const axios = require('axios');
const moment = require('moment');
const PlaceService = {};

PlaceService.createPlace = (business_id, business_name, img_url, categories, rating, lat, long, price, address_, city, state_, zip, phone) => {
	const sql = `INSERT INTO places (business_id, business_name, img_url, categories, rating, lat, long, price, address_, city, state_, zip, phone)
		VALUES ($[business_id], $[business_name], $[img_url], $[categories], $[rating], $[lat], $[long], $[price], $[address_], $[city], $[state_], $[zip], $[phone])`
	return db.none(sql, { business_id, business_name, img_url, categories, rating, lat, long, price, address_, city, state_, zip, phone })
};

PlaceService.readPlaceInRadius = (lat, long) => {
	const max_lat = parseFloat(lat) + 0.00725, min_lat = parseFloat(lat) - 0.00725;
  const max_long = parseFloat(long) + 0.00725, min_long = parseFloat(long) - 0.00725;
	return db.any('SELECT * FROM places WHERE lat > $[min_lat] AND lat < $[max_lat] AND long > $[min_long] AND long < $[max_long]', { max_lat, min_lat, max_long, min_long });
};

PlaceService.readYelpAPI = ( offset = 0 ) => {
	const url = `https://api.yelp.com/v3/businesses/search`
	const term = `?location=NYC&limit=50&offset=${offset}`
	const API_Key = `OO3Saz0hvxk-v0QFSvDyL79ElNRxg_BPX0A46BOqWVtdjYN_xRPa4vpvFuPwr6T-wZpzUNUM3uaL_FticZyIhVkKMwm3yFfDY_m7MQ-MxDI4lLQOeTDcaJjPwoXhXHYx`
	axios.get(`${url}${term}`,
	{headers: {Authorization: `Bearer ${API_Key}`}})
	.then(res=>{
		const {businesses} = res.data 
		businesses.forEach( e =>{
			const {id, name, image_url, categories, rating, price, phone} = e
			const {latitude, longitude} = e.coordinates
			const {address1, city, zip_code, state} = e.location
			PlaceService.createPlace(id, name, image_url, categories, rating, latitude, longitude, address1, city, state, zip_code, phone)
			.catch(console.log)
		})
		return res
	})
	.then(res => {
		if(res.data.businesses.length > 1) PlaceService.readYelpAPI((offset+50))
	})
	.catch(console.log)
};

PlaceService.deletePlace = () => {
	return db.none(`DROP TABLE IF EXISTS places
			CREATE TABLE places (
			id SERIAL PRIMARY KEY,
  			business_id VARCHAR NOT NULL,
			business_name VARCHAR NOT NULL,
			img_url VARCHAR,
			categories [],
			rating NUMERIC,
			lat NUMERIC NOT NULL,
			long NUMERIC NOT NULL,
			price VARCHAR, 
			address_ VARCHAR NOT NULL,
			city VARCHAR NOT NULL,
			state_ VARCHAR NOT NULL,
			zip VARCHAR NOT NULL,
			phone NUMERIC
			)`)
};

module.exports = {PlaceService}
