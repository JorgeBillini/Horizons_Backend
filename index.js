//MODULES
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let env = '';
if (process.env.NODE_ENV !== 'production') env = require('dotenv').config();

//ROUTERS
const userRouter = require('./routes/users');
const badgeRouter = require('./routes/badges');
const awardRouter = require('./routes/awards');
const eventRouter = require('./routes/events');
const job = require('./services/cron');

//APP
const app = express();

//CRON
job.start();

//ROUTERS & MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/badges', badgeRouter);
app.use('/awards', awardRouter);

//TEST ROUTE
app.get('/', (req, res) => {
  res.json({'test': true});
});

//ETC. 
app.listen(process.env.PORT || 5001, () => {
  console.log(`listening on port ${process.env.PORT || 5001}`)
})
