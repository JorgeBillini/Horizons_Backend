const db = require('./db');
const axios = require('axios');
const moment = require('moment');
const EventService = {};

EventService.clearTable = () => db.none(
  `DROP TABLE IF EXISTS events
   CREATE TABLE EVENTS (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR NOT NULL,
    categ VARCHAR NOT NULL,
    sub_categ VARCHAR,
    desc JSON NOT NULL,
    url VARCHAR NOT NULL, 
    start JSON NOT NULL,
    end JSON NOT NULL,
    price VARCHAR NOT NULL,
    summary VARCHAR NOT NULL,
    organizer VARCHAR,
    logo VARCHAR,
    venue JSON,
    capacity INT
   )`
);

EventService.getEvents = (resA = [], continuation = null) => {
  if (continuation) return axios.get(
    'https://www.eventbriteapi.com/v3/events/search/', 
    {
      'headers': {
        'authorization': 'INSERT oAUTH KEY HERE/ACCESS FROM ENV VAR',
        'content-type': 'application/json',
      },
      'params': {
        'pagination': {
          'continuation': continuation,
        },
        'location': {
          'address': 'NY',
          'within': '100mi',
        },
        'start_date':{
          'range_start': moment(Date.now()).format('YYYY-MM-DD')+'T00:00:00',
          'range_end': moment(Date.now()).format('YYYY-MM-DD')+'T23:59:59',
        },
      },
    }
  ).then(res => {
    if(res.data.pagination.has_more_items !== false){
      resA.push(res)
      return EventService.getEvents(resA, res.data.pagination.continuation);
    }
    else return resA;
  });
  else return axios.get(
    'https://www.eventbriteapi.com/v3/events/search/', 
    {
      'headers': {
        'authorization': 'INSERT oAUTH KEY HERE/ACCESS FROM ENV VAR',
        'content-type': 'application/json',
      },
      'params': {
        'location': {
          'address': 'NY',
          'within': '100mi',
        },
        'start_date':{
          'range_start': moment(Date.now()).format('YYYY-MM-DD')+'T00:00:00',
          'range_end': moment(Date.now()).format('YYYY-MM-DD')+'T23:59:59',
        },
      }
    }
  ).then(res => {
    if(res.data.pagination.has_more_items !== false){
      resA.push(res)
      return EventService.getEvents(resA, res.data.pagination.continuation);
    }
    else return resA;
  })
};

EventService.updateEvents = () => {
  EventService.clearTable()
    .then(() => {
      return EventService.getEvents();
    })
    .then(res => {
      //Extract data from the array
      //For loop to build insert SQL query
      //db.any call to execute the sql query
    })
}