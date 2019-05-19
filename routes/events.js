const express = require('express');
const eventRouter = express.Router();
const EventService = require('../services/events');

eventRouter.get('/',  (req, res, next) => {
  const { lat, long } = req.body;
  EventService.getEventsInRadius(lat, long)
    .then(data => {
      res.status(200);
      res.json({'data':data});
    })
    .catch(err => {
      res.json({'error':err});
    });
});

module.exports = eventRouter;