var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");

// Our scraping tools
var cheerio = require("cheerio");

// Require all models
//var db = require("./models");

var PORT = 3000 || process.env.PORT;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Initialize Express
var app = express();

// Configure middleware
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);  

app.get("/scrape", function(req, res) {

    request("https://www.npr.org/sections/news/", function(error, response, html) {

    var $ = cheerio.load(html);

    var results = [];

    $(".item-info").each(function(i, element) {
        var link = $(element).find(".title").children("a").attr("href");
        var title = $(element).find(".title").children("a").text();
        var summary = $(element).find(".teaser").children("a").text();

        results.push({
            title: title,
            link: link,
            summary: summary
        })
    });

    console.log(results);
    });

});

app.listen(PORT, function() {
    console.log("app running on port 3000");
})
