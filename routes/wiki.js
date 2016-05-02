'use strict';
var express = require('express');
var wikiRoutes = express.Router();

module.exports = function makeWR (server, models) {
  wikiRoutes.post('/', postPage);
  wikiRoutes.get('/add', (req, res, next) => res.render('addpage'))
  wikiRoutes.get('/:urlTitle', (req, res, next) => {
    models.Page.findOne({
      where: {
        urlTitle: req.params.urlTitle,
      }
    }).then((result) => {
      // console.log('result:',result);
      console.log(result);
        res.render('wikipage', result.dataValues);
    }).catch(next);
  });

  return wikiRoutes;




//Route Logic

function postPage(req, res, next) {
  var page = models.Page.build({
    title: req.body.title,
    content: req.body.pageContent,
    status: req.body.pageStatus
  })
  page.save().then( (newPage) => {
    res.redirect(newPage.routes)
  }).catch(next);
}


}
