const db = require('./db');
const axios = require('axios');
const moment = require('moment');
const EventService = {};

EventService.clearTable = () => db.none(
  `DROP TABLE IF EXISTS events;
   CREATE TABLE EVENTS (
    id SERIAL PRIMARY KEY,
    name_ VARCHAR NOT NULL,
    description_ VARCHAR,
    url_ VARCHAR NOT NULL, 
    starts TIMESTAMP NOT NULL,
    ends TIMESTAMP NOT NULL,
    price VARCHAR NOT NULL,
    logo VARCHAR,
    venue VARCHAR,
    lat VARCHAR ,
    long VARCHAR,
    capacity INT
   )`
);

EventService.getEvents = async () => {
  let resArray = [];
  const s = `${encodeURI(moment(Date.now()).format('YYYY-MM-DD')+'T00:00:00')}`;
  const e = `${encodeURI(moment(Date.now()).format('YYYY-MM-DD')+'T23:59:59')}`;
  const a = `${encodeURI('New York, NY')}`;
  const t = `${process.env.EVENTBRITE_API_KEY}`;
  const w = `100mi`;
  const x = `${encodeURI('venue')}`;
  let res = await axios.get(`https://www.eventbriteapi.com/v3/events/search/?location.address=${a}&location.within=${w}&start_date.range_start=${s}&start_date.range_end=${e}&expand=${x}&token=${t}`);
  resArray.push(res.data);
  while(res.data.pagination.has_more_items !== false){
    p = `${res.data.pagination.page_number + 1}`
    const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${a}&location.within=${w}&start_date.range_start=${s}&start_date.range_end=${e}&expand=${x}&page=${p}&token=${t}`
    res = await axios.get(url);
    resArray.push(res.data);
  };
  let output = [];
  for(let i = 0; i < resArray.length; i++){
    const events = resArray[i].events
    for(let j = 0; j < resArray[i].events.length; j++){
      const ev = events[j]
      const event = {}
      event.name = ev.name.text
      event.description = ev.description.text;
      event.url = ev.url;
      event.starts = ev.start.utc;
      event.ends = ev.end.utc;
      event.price = ev.is_free ? 'free' : 'paid'
      event.logo = ev.logo !== null ? ev.logo.url : '';
      event.venue = {
        'name': ev.venue.name,
        'address': ev.venue.localized_multi_line_address_display,
        'age_restriction': ev.venue.age_restriction,
      };
      event.lat = ev.venue.latitude;
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
      (name_, description_, url_, starts, 
       ends, price, logo, venue, lat, long, capacity) 
      VALUES ($[name],$[description],$[url],$[starts],$[ends],$[price],$[logo],$[venue],$[lat],$[long],$[capacity])`
      for (let element of res) {
        console.log(element,"is element ")
        let {name,price,logo, venue,lat,long,capacity,description,url,starts,ends} = element;
        venue = JSON.stringify(venue)
        db.none(sql,{name,price,logo,venue,lat,long,capacity,description,url,starts,ends})
      }
    })
    .catch(err => {
      console.log(err);
    });
};

EventService.getEventsInRadius = (min_lat, max_lat, min_long, max_long) => { 
  const now = moment(Date.now()).format('YYYY-MM-DD')+' '+moment(Date.now()).format('HH')+':00:00';
  const end = moment(Date.now()).format('YYYY-MM-DD')+' 23:59:59';
  return db.any('SELECT * FROM events WHERE lat > $[min_lat] AND lat < $[max_lat] AND long > $[min_long] AND long < $[max_long] AND starts BETWEEN $[now] AND $[end]', { max_lat, min_lat, max_long, min_long, now, end });
};

module.exports = EventService;