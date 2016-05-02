'use strict';
var express = require('express');
var routes = express.Router();
var wikiRoutes = require('./wiki.js')

module.exports = function makeRouter (server, models) {
  routes.use('/wiki', wikiRoutes(server, models));

  routes.get('/', (req, res, next) => {
    models.Page.findAll().then((result) => {
      var mappedResult = result.map(function(post) {
        post.dataValues.routes = post.$modelOptions.getterMethods.routes.call(post);
        return post.dataValues;
      });
      // console.log('result is: ', mappedResult);
      res.render('index.html', {mappedResult: mappedResult});
    });
  });

  return routes;
}
