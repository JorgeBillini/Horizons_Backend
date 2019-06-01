const express = require('express');
const eventRouter = express.Router();
const EventService = require('../services/events');

eventRouter.get('/',  (req, res, next) => {
  const { min_lat, min_long, max_lat, max_long } = req.body;
  EventService.getEventsInRadius(min_lat, min_long, max_lat, max_long)
    .then(data => {
      res.status(200);
      res.json({'data':data});
    })
    .catch(err => {
      res.json({'error':err});
    });
});

eventRouter.get('/u', (req, res, next) => {
  EventService.updateEvents()
  .then(() => {
    res.json({success: true});
  })
  .catch(err => {
    res.json({'error': err});
  });
});

module.exports = eventRouter;