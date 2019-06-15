const db = require('./db');
const axios = require('axios');
const moment = require('moment');
const pastEventService = require('./past-events');
const EventService = {};

EventService.createEvent = ({user_id, name_, description_, category, url_, starts, ends, price, logo, venue, lat, long, capacity}) =>{
  const sql = `
    INSERT INTO events 
    (user_id, name_, description_, category, url_, starts, ends, price, logo, venue, lat, long, capacity) 
    VALUES
    ($[user_id], $[name_], $[description_], $[category], $[url_], $[starts], $[ends], $[price], $[logo], $[venue], $[lat], $[long], $[capacity])
    RETURNING *;
  `;
  return db.one(sql, {user_id, name_, description_, category, url_, starts, ends, price, logo, venue, lat, long, capacity});
}

EventService.getCurrentEventsByUserId = (id) =>{
  const sql = `
    SELECT * FROM events
    WHERE user_id=$[id];
  `;
  return db.any(sql, {id});
}

EventService.getPastEvents = () =>{
  const sql = `
      SELECT * FROM events
      WHERE user_id IS NOT NULL;
  `
  return db.any(sql);
}

EventService.clearTable = () => db.none(
  `DROP TABLE IF EXISTS events;
   CREATE TABLE EVENTS (
    id SERIAL PRIMARY KEY,
    user_id INT,
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE,
    name_ VARCHAR NOT NULL,
    description_ VARCHAR,
    category VARCHAR,
    url_ VARCHAR, 
    starts TIMESTAMP NOT NULL,
    ends TIMESTAMP NOT NULL,
    price VARCHAR NOT NULL,
    logo VARCHAR,
    venue VARCHAR NOT NULL,
    lat NUMERIC,
    long NUMERIC,
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
      event.user_id = null
      event.category = 'undefined'
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
      event.lat = parseFloat(ev.venue.latitude);
      event.long = parseFloat(ev.venue.longitude);
      event.capacity = parseFloat(ev.venue.capacity);
      output.push(event);
    };
  };
  return output;
};

EventService.updateEvents = async () => {
  EventService.getPastEvents()
    .then(arr =>{
      return pastEventService.createEvents(arr);
    })
    .then( () => {
      return EventService.clearTable();
    })
    .then(() => {
      return EventService.getEvents();
    })
    .then(res => {
      let sql = `INSERT INTO events 
      (name_, user_id, description_, category, url_, starts, 
       ends, price, logo, venue, lat, long, capacity) 
      VALUES ($[name], $[user_id], $[description], $[category], $[url],$[starts],$[ends],$[price],$[logo],$[venue],$[lat],$[long],$[capacity])`
      for (let element of res) {
        let {name,user_id, category, price,logo, venue,lat,long,capacity,description,url,starts,ends} = element;
        venue = JSON.stringify(venue)
        db.none(sql,{name, user_id, category, price,logo,venue,lat,long,capacity,description,url,starts,ends})
      }
    })
    .catch(err => {
      console.log(err);
    });
};

EventService.getAllEvents = () => {
	return db.any('SELECT * FROM events')
}

EventService.getEventsInRadius = (min_lat, max_lat, min_long, max_long) => { 
  const now = moment(Date.now()).format('YYYY-MM-DD')+' '+moment(Date.now()).format('HH')+':00:00';
  const end = moment(Date.now()).format('YYYY-MM-DD')+' 23:59:59';
  return db.any('SELECT * FROM events WHERE CAST(lat AS NUMERIC) > $[min_lat] AND CAST(lat AS NUMERIC) < $[max_lat] AND CAST(long AS NUMERIC) > $[min_long] AND CAST(long AS NUMERIC) < $[max_long] AND starts BETWEEN $[now] AND $[end]', { max_lat, min_lat, max_long, min_long, now, end });
};

module.exports = EventService;
