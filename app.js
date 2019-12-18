require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

mongoose
  .connect(process.env.MONGOATLAS_URI, { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`,
    );
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

// const app_name = require('./package.json').name;
// const debug = require('debug')(
// `${app_name}:${path.basename(__filename).split('.')[0]}`,
// );


const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }),
);


const apiRoutes = require('./routes/api.routes');

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
