const express = require('express');
const placeRouter = express.Router();
const {PlaceService} = require('../services/places.js');

module.exports = placeRouter;

placeRouter.get('/', (req, res)=>{
	const {min_lat, max_lat, min_long, max_long} = req.query
	PlaceService(min_lat,max_lat, min_long, max_long)
	.then(data=>res.json({'msg':data}))
	.catch(err=>
		console.log(err)
		res.json{'msg':'error'})	
});
