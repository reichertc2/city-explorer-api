'use strict';

const axios = require('axios');
let cache = require('./cache.js');

async function movieData(request, response) {
  let MOVIE_API_KEY = process.env.MOVIE_API_KEY;
  let { searchQuery } = request.query;
  // console.log('req query', request.query);
  if (cache[searchQuery] && Date.now() - cache[searchQuery].timeStamp < 1000 * 10) {

    response.status(200).send(cache[searchQuery]);
    console.log(cache, 'CACHE HIT - Movies!!');
  }
  else {
    try {
      let movieApiURL = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;
      // console.log(movieApiURL);
      let movieApi = await axios.get(movieApiURL);
      const movies = movieApi.data;
      // console.log(movies);
      let movieArray = movies.results.map(movies => {
        return new Movie(movies);
      });
      // console.log('this is my movieArray',movieArray);
      cache[searchQuery] = {
        movie: movieArray,
        timeStamp: Date.now()
      };
      console.log(cache, 'CACHE MISS - Movies');
      response.status(200).send(movieArray);
    }
    catch (error) {
      response.status(404).send('Movies not found');
    }
  }
}

class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_count;
    this.imageURL = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
    this.popularity = movieData.popularity;
    this.released_on = movieData.released_date;
    this.key = movieData.title;
  }
}


module.exports = movieData;
