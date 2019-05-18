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

EventService.getEvents = async () => {
  let resArray = [];
  let res = await axios.get(
    'https://www.eventbriteapi.com/v3/events/search/', 
    {
      'headers': {
        'authorization': 'INSERT oAUTH KEY HERE/ACCESS FROM ENV VAR',
        'content-type': 'application/json',
      },
      'params': {
        'expand': 'venue, organizer',
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
  );
  resArray.push(res);
  while(res.pagination.has_more_items){
    res = await axios.get(
      'https://www.eventbriteapi.com/v3/events/search/', 
      {
        'headers': {
          'authorization': 'INSERT oAUTH KEY HERE/ACCESS FROM ENV VAR',
          'content-type': 'application/json',
        },
        'params': {
          'continuation': res.pagination.continuation,
          'expand': 'venue, organizer',
          'location': {
            'address': 'NY',
            'within': '100mi',
          },
          'start_date':{
            'range_start': moment(Date.now()).format('YYYY-MM-DD')+'T00:00:00',
            'range_end': moment(Date.now()).format('YYYY-MM-DD')+'T23:59:59',
          },
        },
      });
    resArray.push(res);
  };
  let output = [];
  for(let i = 0; i < resArray.length; i++){
    const events = resArray[i].events
    for(let j = 0; j < resArray[i].events.length; j++){
      const ev = events[j]
      const event = {}
      event.name = ev.name.text
      event.category = ev.category.name;
      event.subcategory = ev.category.subcategories.name;
      event.format = ev.format.short_name;
      event.description = ev.long_description.text;
      event.url = ev.url;
      event.starts = ev.start.utc;
      event.ends = ev.end.utc;
      event.price = ev.is_free ? 'free' : ev.maximum_ticket_price.value;
      event.organizer = ev.organizer.name;
      event.logo = ev.logo.url;
      event.venue = {
        'name': ev.venue.name,
        'address': ev.venue.localized_multi_line_address_display,
        'age_restriction': ev.venue.age_restriction,
      };
      event.lat = ev.venue.latitutde;
      event.long = ev.venue.longitude;
      event.capacity = ev.venue.capacity;
      output.push(event);
    };
  };
  return output;
};

EventService.updateEvents = async () => {
  EventService.clearTable()
    .then(() => {
      return EventService.getEvents();
    })
    .then(res => {
      let sql = `INSERT INTO events 
      (name, category, subcategory, format, description_, url_, starts, 
       ends, price, organizer, logo, venue, lat, long, capacity) 
      VALUES`
      for(let i = 0; i < res.length; i++){
        let string = '('
        const keys = Object.keys(res[i])
        for(let j = 0; j < keys.length; j++){
          string += `${keys[k]}`
          if (j < keys.length - 1) string+=", ";
        };
        if(i < res.length -1) string += '),';
        else string += ');';
        sql += string;
      };
      return db.any(sql);
    });
};

EventService.getEventsInRadius = (max_lat, min_lat, max_long, min_long) => {  
  const now = moment(Date.now()).format('YYYY-MM-DD')+'T'+moment(Date.now()).format('HH')+'00:00';
  const end = moment(Date.now()).format('YYYY-MM-DD')+'T23:59:59';
  return db.any('SELECT * FROM events WHERE lat > $[min_lat] AND lat < $[max_lat] AND long > $[min_long] AND long < $[max_long] AND starts BETWEEN $[now] AND $[end]', { max_lat, min_lat, max_long, min_long, now, end });
};

module.exports = EventService;