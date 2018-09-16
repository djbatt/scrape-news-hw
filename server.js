var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require("express-handlebars");

// Our scraping tools
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000 || process.env.PORT;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Initialize Express
var app = express();

// Configure middleware
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);  

app.get("/", function(req, res) {
    res.render("index");
})

app.get("/scrape", function(req, res) {

    request("https://www.npr.org/sections/news/", function(error, response, html) {

    var $ = cheerio.load(html);

    var result = {};

    $(".item-info").each(function(i, element) {

        result.link = $(element).find(".title").children("a").attr("href");
        result.title = $(element).find(".title").children("a").text();
        result.summary= $(element).find(".teaser").children("a").text();

        db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle)
        }).catch(function(err) {
            return res.json(err);
        })
    });
    });

    res.send("scrape complete");

});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
        res.json(err);
    })
})

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
        res.json(err);
    })
})

app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
    .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    })
})

app.listen(PORT, function() {
    console.log("app running on port 3000");
})
