require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movie-data-small.json');

const server = express();

server.use(morgan('common'));
server.use(helmet());
server.use(cors());

function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: 'Unauthorized request'});
  }
  next();
}

server.use(validateBearerToken);

server.get('/movie', function handleGetMovie(req, res) {
  let response = movies;

  const { genre, country, avg_vote } = req.query;
  
  if(genre) {
    response = movies.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country) {
    response = movies.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  const voteNumber = Number(`${avg_vote}`);

  if(avg_vote) {
    response = movies.filter(movie => movie.avg_vote >= voteNumber);
  }

  res.json(response);
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});