const express = require('express');
const eventRouter = express.Router();
const EventService = require('../services/events');

eventRouter.get('/',  (req, res, next) => {
  const { min_lat, max_lat, min_long, max_long } = req.body;
  EventService.getEventsInRadius(max_lat, min_lat, max_long, min_long)
    .then(data => {
      res.status(200);
      res.json({'data':data});
    })
    .catch(err => {
      res.json({'error':err});
    });
});

module.exports = eventRouter;