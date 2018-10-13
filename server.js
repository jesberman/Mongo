
//npm packages needed to run server and application
var express = require("express");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var bodyParser = require("body-parser");
var axios = require("axios");
var mongoose = require('mongoose');
var MONGODB_URI = process.env.MONGODB_URI;

//creates and "app" variable and sets it equal to the expess function.  Needed to run the server
var app = express();

//sets the port to 8080
var PORT = 8080;

//creates a variable "db" and gives it access to files in the "models" directory
var db = require("./models");

//uses boydparser to parse the incoming request
app.use(bodyParser.urlencoded({ extended: true }));

//tells the code to look in the "public" directory for static files like html and css it can 
//use for the front end
app.use(express.static("public"));

//creates a var "url", and sets it equal to the website for the Washinton Post
var url = "https://www.washingtonpost.com/";


mongoose.Promise=Promise;
//uses mongoose to connect to the local mongo database and look inside the washpost database
mongoose.connect(MONGODB_URI||"mongodb://localhost/washpost", { useNewUrlParser: true });

//creates a variable "emptyArray" and sets it equal, appropriately, to an empty array
var emptyArray = []

//creates a variable "job" and sets it equal to an empty object
var job = {};

//creates a variable "start" and sets it to equal an opening h3 tag
var start = '<h3>';

//creates a variable "end" and sets it to equal a closing h3 tag
var end = '</h3>';

app.use(express.static(__dirname + '/public'));

//tells the code to 'listen' for activity on port 8080, and to console.log a confirmation message
//once that activity is detected
app.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env)
});
console.log("server is listening on port: " + PORT);

//"Get" route that is used to retrieve information from the mongo database and display it on the front end
app.get("/scrape", function (req, res){
    db.Headline
    .find({})
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
});

//"Post" route that is used to 
app.post("/scrape", function (req, res) {
    request(url, function (err, resp, body) {
        //uses the "cheerio" npm package to establish a type of virtual jQuery that can 
        //be used with mongo
        var $ =cheerio.load(body);
        var scrapedHeadlines =$('.headline a');
        var headlines = [];
        for (i=0; i <10; i++) {
            var headline = {
                title: $(scrapedHeadlines[i]).text(),
                link: $(scrapedHeadlines[i]).attr("href"),
                note: []
            }
            headlines.push(headline);
        }
        console.log(headlines);
        db.Headline
        .insertMany(headlines)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    });
});

app.post("/scrape/:id", function(req, res) {
    db.Headline.findOneAndUpdate({ _id: req.params.id }, { $push: {note: req.body.body }}, { new: true})
      .then(function(dbHeadline) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbHeadline);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  app.get("/scrape/:id", function(req, res) {
    db.Headline
    .find({_id: req.params.id})
    .then(dbNote => res.json(dbNote))
  });

app.get("/index", function (req, res) {
    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);

        var headline =$('.headline');
        var headlineText = headline.text();
        
        var blurb =$('.blurb');
        var blurbText = blurb.text();

         job = {        
            headline: headlineText,
            blurb: blurbText
        }

        var stringJob = JSON.stringify(job);
        emptyArray.push(stringJob); 

        var newText =(start)+(emptyArray)+(end);
        console.log("job:");
        console.log(job);
        res.send(newText);
    });
});


app.get("/", function (req, res) {
    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);
    });
    res.sendFile(path.join(__dirname, "./index.html"));  
});

app.get("/posting", function(req, res){
   request('https://www.washingtonpost.com/', function (error, message, html) {
    res.send(html);
   });
});

app.get("/test", function(req, res){
    
    var test = 'test';
    var htmlText = '<h2>';
    htmlText += test;
    htmlText += '</h2>';
    res.send(htmlText);
});