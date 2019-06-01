const express = require('express');
const placeRouter = express.Router();
const {PlaceService} = require('../services/places.js');

module.exports = placeRouter;

placeRouter.get('/', (req, res)=>{
	const {lat, long} = req.query
	PlaceService.readPlaceInRadius(lat, long)
	.then(data=>res.json({'msg':data}))
	.catch(err=>{
		console.log(err)
		res.json({'msg':'error'})
	})	
});
