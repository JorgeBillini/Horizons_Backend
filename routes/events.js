const express = require('express');
const eventRouter = express.Router();
const EventService = require('../services/events');
const PastEventService = require('../services/past-events');

eventRouter.post('/', (req, res) =>{
  const {user_id, name_, description_, category, url_, starts, ends, price, logo, venue, lat, long, capacity} = req.body;
  EventService.createEvent({user_id, name_, description_, category, url_, starts, ends, price, logo, venue, lat, long, capacity})
    .then(event =>{
      res.status(200);
      res.json({eventCreated: event});
    })
    .catch(err =>{
      res.json({'error': err});
    })
});

eventRouter.get('/past/:user_id', (req, res) =>{
  const {user_id} = req.params;
  PastEventService.readEventsByUserId(user_id)
    .then(data =>{
      res.status(200);
      res.json({data});
    })
    .catch(err =>{
      res.json({'error': err});
    })
})

eventRouter.get('/:user_id', (req, res) =>{
  const {user_id} = req.params;
  EventService.getCurrentEventsByUserId(user_id)
    .then(data =>{
      res.status(200);
      res.json({data});
    })
    .catch(err =>{
      res.json({'error': err});
    })
})

eventRouter.get('/',  (req, res) => {
  const { min_lat, min_long, max_lat, max_long } = req.query;
  EventService.getEventsInRadius(min_lat, max_lat, min_long, max_long)
    .then(data => {
      res.status(200);
      res.json({'data':data});
    })
    .catch(err => {
      res.json({'error':err});
    });
});

eventRouter.get('/u', (req, res) => {
  EventService.updateEvents()
  .then(() => {
    res.json({success: true});
  })
  .catch(err => {
    res.json({'error': err});
  });
});

module.exports = eventRouter;