'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var bodyParser = require('body-parser');
var socketio = require('socket.io');


// templating boilerplate setup
app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({
    cache: false
});

var models = require('./models');
var routes = require('./routes');

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({
    extended: true
})); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests




// the typical way to use express static middleware.
app.use(express.static(path.join(__dirname, '/public')));

// start the server
models.db.sync().then(() => {
  var server = app.listen(3000, function() {
    console.log('listening on port 3000');
  });
  app.use('/', routes(server, models));
}).catch(console.error);
