'use strict';


var sequelize = require('sequelize');

var db = new sequelize('postgres://localhost:5432/wikistack');


var User = db.define('user', {
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  email: {
    type: sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

// Model.define(modelName, columns, options);
var Page = db.define('page', {
  title: {
    type: sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: sequelize.STRING,
    allowNull: false
  },
  content: {
    type: sequelize.STRING,
    allowNull: false
  },
  date: {
    type: sequelize.DATE,
    defaultValue: sequelize.NOW
  },
  status: {
    type: sequelize.ENUM('open','closed')
  }
}, {
  getterMethods: {
    routes: function() {
      // console.log('page:',page);
      // console.log('this:',this);
      return '/wiki/' + this.urlTitle;
    }
  },
  hooks: {
    beforeValidate: (page, options) => {
      // console.log(page);
      page.urlTitle = page.title.trim().replace(/\s/g,"_").replace(/\W/g,"")
    }
  }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
}
