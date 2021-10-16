'use strict';

const axios = require('axios');

async function weatherData(request, response) {
  try {
    let WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    // ---- The following 1 line and subsequent 3 are doing the same things. ----
    let { searchQuery } = request.query;
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
      // console.log(foundArray);
    response.status(200).send(foundArray);
  }
  catch (error) {
    response.status(404).send('Weather not found');
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
