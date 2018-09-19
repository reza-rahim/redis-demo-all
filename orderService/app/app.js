var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var userRoutes = require('./routes/index');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRoutes);

module.exports = app;
