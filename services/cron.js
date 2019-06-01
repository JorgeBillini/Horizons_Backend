const CronJob = require('cron').CronJob;
const EventService = require('./events');

const job = new CronJob('00 00 03 * * *', () => {
  EventService.getEvents()
    .catch(err => {
      console.log(err)
    })
  console.log('running eventbrite script')
}, null, true, 'America/New_York');

module.exports = job;
