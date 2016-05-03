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

  routes.get('/users', (req, res, next) => {
    models.User.findAll().then((result) => {
      var mappedResult = result.map(function( user ) {
        user.dataValues.authorRoute = user.$modelOptions.getterMethods.authorRoute.call(user);
        return user.dataValues;
      });
    res.render('users.html', {mappedResult: mappedResult});
    });
  });
  routes.get('/users/:id', (req, res, next) => {

    models.Page.findAll({
      where: {
        authorId: req.params.id
      }}).then((result) => {
        var mappedPages = result.map(function( page ) {
          page.dataValues.routes = page.$modelOptions.getterMethods.routes.call(page);
          return page.dataValues;
        });
        models.User.findOne({
          where: {
            id: req.params.id
          }}).then((userResult) => {
            var user = userResult.dataValues;
            res.render('authorPage.html', {
              pages: mappedPages,
              author: user
            });
          })
        })
      })

    routes.get('/search', (req, res, next) => {
      res.render('searchtags.html');
    })
    routes.get('/search/q', (req, res, next) => {
      var tags = req.query.tagsArray.split(/\s?\,\s?/g);
      models.Page.searchByTag(tags).then( (result) => {
        var matchingRows = result.map(function(post) {
          post.dataValues.routes = post.$modelOptions.getterMethods.routes.call(post);
          post.dataValues.tags = post.dataValues.tags.join(", ");
          return post.dataValues;
        });
        res.render('tagresults.html', {
          pages: matchingRows
        })
      })
    })

  return routes;
}
