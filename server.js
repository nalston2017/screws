// Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var exphbs = require("express-handlebars");
var Note = require("./models/Note.js");
var Headline = require("./models/Headline.js");
var htmlRouter = require("./controllers/headline.js");
var articleRouter = require("./controllers/fetch.js");

// Initialize Express
var port = process.env.PORT || 3000;
var app = express();

// use morgan and bodyparser app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static directory
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
