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
// const webPORT = 'https://fierce-badlands-59125.herokuapp.com';
const PORT = process.env.PORT || 3001;

// Setting the root route
app.get('/', (request, response) => {
  response.send('Running Server Program');
});

// module requires
let weatherData = require('./modules/weather.js');
let movieData = require('./modules/movies.js');
let cache = require('./modules/cache.js');


// setting other routes
app.get('/weather', weatherData);
app.get('/movies', movieData);

// catch all other not listed routes
app.get('*', (reqeust, response) => {
  response.status(404).send('Page not found');
});


// End Boiler Plate Items

function handleError(request, response) {
  try {

    console.log(response);
    response.status(500).send(response);
  }
  catch (error) {
    response.status(404).send('Request not found');
  }
}

app.listen(PORT, () => {
  console.log('Awaiting Instructions on Port: ', PORT);
});
