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

// Setting the root route
app.get('/', (request, response) => {
  response.send('Running Server Program');
});
app.get('/weather', weatherData);

app.get('*', (reqeust, response) => {
  response.status(404).send('Page not found');
});



// End Boiler Plate Items

const weather = require('./data/weather.json');

// console.log(`This is my weather.json ${weather}`);

function weatherData(request, response) {

  // ---- The following 1 line and subsequent 3 are doing the same things. ----
  let { lat, lon, searchQuery } = request.query;
  // let lat = request.query.lat;
  // let lon = request.query.lon;
  // let searchQuery = request.query.searchQuery;
  // ----- end similiar items--------------------------------------------------
  console.log(`This is the lat: ${lat}`);
  console.log(`This is the lat: ${lon}`);
  console.log('req query', request.query);
  let found = weather.find((city) => city.city_name.toLowerCase() === searchQuery.toLowerCase());
  console.log(found);
  try {
    let foundArray = found.data.map(day => {
      return new Forecast (day);
    });
    console.log(foundArray);
    response.status(200).send(foundArray);
  }
  catch (error) {
    response.status(404).send('Weather not found');
  }
}



class Forecast {
  constructor(day){
    this.date = day.valid_date;
    this.description = `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

app.listen(PORT, () => {
  console.log('Awaiting Instructions on Port: ', PORT);
});
