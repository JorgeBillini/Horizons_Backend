const CronJob = require('cron').CronJob;
const EventService = require('./events');

const job = new CronJob('00 00 03 * * *', () => {
  EventService.updateEvents();
}, null, true, 'America/New_York');

module.exports = nuJob;