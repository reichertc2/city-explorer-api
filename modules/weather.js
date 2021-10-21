'use strict';

const axios = require('axios');
let cache = require('./cache.js');

async function weatherData(request, response) {
  let { searchQuery } = request.query;
  if (cache[searchQuery] && Date.now() - cache[searchQuery].timeStamp < 1000 * 60 * 23.8) {
    response.status(200).send(cache[searchQuery]);
    console.log(cache, 'CACHE HIT - Weather!!');
  }
  else {
    try {
      let WEATHER_API_KEY = process.env.WEATHER_API_KEY;
      // ---- The following 1 line and subsequent 3 are doing the same things. ----

      // let lat = request.query.lat;
      // let lon = request.query.lon;
      // let searchQuery = request.query.searchQuery;
      // ----- end similiar items--------------------------------------------------

      // console.log('weather api', WxApi.data.data);
      // console.log(`This is the lat: ${lat}`);
      // console.log(`This is the lat: ${lon}`);
      // console.log('req query', request.query);
      // let found = weather.find((city) => city.city_name.toLowerCase() === searchQuery.toLowerCase());
      // console.log('this is found', found);

      let WxApiURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${searchQuery}&key=${WEATHER_API_KEY}&days=4`;
      let WxApi = await axios.get(WxApiURL);
      const weather = WxApi.data.data;
      let foundArray = weather.map(day => {
        return new Forecast(day);
      });
      cache[searchQuery] = {
        weather: foundArray,
        timeStamp: Date.now()
      };
      console.log(cache, 'CACHE MISS - Weather');
      // console.log(foundArray);
      response.status(200).send(foundArray);
    }
    catch (error) {
      response.status(404).send('Weather not found');
    }
  }
}

class Forecast {
  constructor(day) {
    this.key = day.datetime;
    this.date = day.datetime;
    this.description = `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

module.exports = weatherData;
