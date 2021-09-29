const express = require('express');
const mongoose = require('./mongoose')
const service = require('./services')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true}));

mongoose(app);
service(app);


module.exports = app;