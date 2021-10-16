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

app.get('/movies', movieData);

app.get('*', (reqeust, response) => {
  response.status(404).send('Page not found');
});

const axios = require('axios');
// End Boiler Plate Items



// console.log(`This is my weather.json ${weather}`);

async function weatherData(request, response) {
  let WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  // ---- The following 1 line and subsequent 3 are doing the same things. ----
  let { lat, lon, searchQuery } = request.query;
  // let lat = request.query.lat;
  // let lon = request.query.lon;
  // let searchQuery = request.query.searchQuery;
  // ----- end similiar items--------------------------------------------------
  let WxApiURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_API_KEY}&days=4`;
  let WxApi = await axios.get(WxApiURL);
  const weather = WxApi.data.data;
  // console.log('weather api', WxApi.data.data);
  // console.log(`This is the lat: ${lat}`);
  // console.log(`This is the lat: ${lon}`);
  // console.log('req query', request.query);
  // let found = weather.find((city) => city.city_name.toLowerCase() === searchQuery.toLowerCase());
  // console.log('this is found', found);
  try {
    let foundArray = weather.map(day => {
      return new Forecast(day);
    });
    // console.log(foundArray);
    response.status(200).send(foundArray);
  }
  catch (error) {
    response.status(404).send('Weather not found');
  }
}

async function movieData(request, response) {
  let MOVIE_API_KEY = process.env.MOVIE_API_KEY;
  let { searchQuery } = request.query;
  // console.log('req query', request.query);
  try {
    let movieApiURL = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;
    // console.log(movieApiURL);
    let movieApi = await axios.get(movieApiURL);
    const movies = movieApi.data;
    // console.log(movies);
    let movieArray = movies.results.map(movies =>{
      return new Movie(movies);
    });
    // console.log('this is my movieArray',movieArray);
    response.status(200).send(movieArray);
  }
  catch (error) {
    response.status(404).send('Movies not found');
  }
}


function handleError(request, response) {
  try {

    console.log(response);
    response.status(500).send(response);
  }
  catch (error) {
    response.status(404).send('Request not found');
  }
}

class Forecast {
  constructor(day) {
    this.key = day.datetime;
    this.date = day.datetime;
    this.description = `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

class Movie {
  constructor(movieData){
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_count;
    this.imageURL = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
    this.popularity = movieData.popularity;
    this.released_on = movieData.released_date;
    this.key = movieData.title;
  }
}

app.listen(PORT, () => {
  console.log('Awaiting Instructions on Port: ', PORT);
});
