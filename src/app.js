const express = require('express');
const helmet = require('helmet');

const mongoose = require('./mongoose')
const service = require('./services')

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended : true}));

mongoose(app);
service(app);


module.exports = app;