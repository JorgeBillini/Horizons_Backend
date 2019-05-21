const CronJob = require('cron').CronJob;
const EventService = require('./events');

const job = new CronJob('35 51 15 * * *', () => {
  EventService.getEvents()
    .catch(err => {
      console.log(err)
    })
  console.log('running eventbrite script')
}, null, true, 'America/New_York');

module.exports = job;