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
eventRouter.post('/',(req,res)=>{
  /*
  name_ VARCHAR NOT NULL,
  description_ VARCHAR,
  url_ VARCHAR NOT NULL, 
  starts TIMESTAMP NOT NULL,
  ends TIMESTAMP NOT NULL,
  price VARCHAR NOT NULL,
  logo VARCHAR,
  venue VARCHAR NOT NULL,
  lat NUMERIC,
  long NUMERIC,
  capacity INT NOT NULL
  */
})
eventRouter.get('/u', (req, res, next) => {
  EventService.updateEvents()
  .then(() => {
    res.json({success: true});
  })
  .catch(err => {
    console.log(err.toString());
    res.json({'error': err.toString()});
  });
});

module.exports = eventRouter;