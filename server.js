'use strict';

// Boiler Plate Items

// Express server
const express = require('express');
const app = express();

// .env file
require('dotenv').config();

// CORS: Security
const cors = require('cors');
app.use(cors());

//PORT assignment
//PORT variable is assigned in .env file
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('Awaiting Instructions on Port: ', PORT);
});

// Setting the root route
app.get('/', (request, response) => {
  response.send('Running Server Program');
});

// End Boiler Plate Items

const weather = require('./data/weather.json');

// console.log(`This is my weather.json ${weather}`);

function weatherData (request,response){
  // let data = request.query;
  let data = weather.data;
  let lat = request.query.lat;
  console.log(`This is the lat: ${lat}`);
  // console.log('req query', request.query);
  const found = weather.find(({lat}) => lat === request.query.lat);
  console.log(found);
  response.status(200).send(weather);
}

app.get('/weather',weatherData);


