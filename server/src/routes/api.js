const express = require('express');
const api = express.Router();

const planetsRoute = require('./planets/planets.router');
const launchesRoute = require('./launches/launches.router');


api.use('/launches', launchesRoute);
api.use('/planets', planetsRoute);

module.exports = api;