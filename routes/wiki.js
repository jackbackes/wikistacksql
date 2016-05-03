'use strict';
var express = require('express');
var wikiRoutes = express.Router();
var marked = require('marked');
var renderer = new marked.Renderer();

module.exports = function makeWR (server, models) {
  wikiRoutes.get('/', (req, res, next) => {
    models.Page.findAll().then((result) => {
      var mappedResult = result.map(function(post) {
        post.dataValues.routes = post.$modelOptions.getterMethods.routes.call(post);
        return post.dataValues;
      });
      // console.log('result is: ', mappedResult);
      res.render('index.html', {mappedResult: mappedResult});
    });
  })
  wikiRoutes.post('/', postPage);
  wikiRoutes.get('/add', (req, res, next) => res.render('addpage'))
  wikiRoutes.get('/:urlTitle', (req, res, next) => {
    // models.Page.findOne({
    //   where: {
    //     urlTitle: req.params.urlTitle,
    //   },
    //   include: [
    //     {model: models.User, as: 'author'}
    //   ]
    // })
    findPageWithAuthor(req, res, next).then((result) => {
      // console.log('result:',result);
        result.dataValues.marked = result.marked().trim();
        result.dataValues.tags = result.dataValues.tags.join(", ");
        console.log('include result:',result.author.name);
        res.render('wikipage', result.dataValues);
    }).catch(next);
  });
  wikiRoutes.get('/:urlTitle/save', (req, res, next) => {

  })

  return wikiRoutes;




//Route Logic

function findPageWithAuthor(req, res, next) {
  return models.Page.findOne({
    where: {
      urlTitle: req.params.urlTitle,
    },
    include: [
      {model: models.User, as: 'author'}
    ]
  })
}

function postPage(req, res, next) {
  var pageAuthor = models.User.findOrCreate({
    where: {
      name: req.body.author,
      email: req.body.authorEmail
    }
  }).then( (author) => {
    var newTags = req.body.tags.split(/\s?\,\s?/g);
    console.log(newTags);
    var page = models.Page.build({
      title: req.body.title,
      content: req.body.pageContent,
      status: req.body.pageStatus,
      // authorId: author[0].id,
      tags: newTags
      });
    page.save()
    .then((page) => page.setAuthor(author[0]))
  })
    .then( (newPage) => res.redirect(newPage.routes))
    .catch(next);
}


}
