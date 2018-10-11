
var express = require("express");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var app = express();
var port = 8080;
var bodyParser = require("body-parser");
var axios = require("axios");
var mongoose = require('mongoose');

var db = require("./models");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));



//-----------------

var databaseUri = 'mongodb://localhost/damp-escarpment-36769';

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on('error', function(err){
    console.log('Mongoose Error:', err);
});

db.once('open', function(){
    console.log('Mongoose connection successful.');
});


//---------------

//var url = "https://www.nytimes.com/"
var url = "https://www.washingtonpost.com/";


mongoose.connect("mongodb://localhost/washpost", { useNewUrlParser: true });


var emptyArray = []

var job = {};
var start = '<h3>';
var end = '</h3>';

app.use(express.static(__dirname + '/public'));




app.listen(port);
console.log("server is listening on port: " + port);



app.get("/index", function (req, res) {
    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);

        //var balancedHeadline = $('.balancedHeadline');
        //var balancedHeadlineText = balancedHeadline.text();

        //var companyName = $('.css-1o3jc43');
        //var companyNameText = companyName.text();
    
        //var jobTitle = $('.css-tu3ssm');
        //var jobTitleText = jobTitle.text();
    
        //var location = $('.esl82me1');
        //var locationText = location.text();
    
        //var summary = $('#job_summary p');
        //var summaryText = summary.text();

        var headline =$('.headline');
        var headlineText = headline.text();
        
        var blurb =$('.blurb');
        var blurbText = blurb.text();

         job = {
            //balancedHeadline: balancedHeadlineText,
            //jobTitle: jobTitleText,
            //location: locationText,
            //companyName: companyNameText,
            //summary: summaryText
           
            headline: headlineText,
            blurb: blurbText
        }
        var stringJob = JSON.stringify(job);
        emptyArray.push(stringJob); 
        //emptyArray.push(job); 

        var newText =(start)+(emptyArray)+(end);
        console.log("job:");
        console.log(job);
        res.send(newText);

    });
    //res.sendFile(path.join(__dirname, "./index.html"));  
});

app.get("/scrape", function (req, res){
    db.Headline
    .find({})
    // .read(articleText)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));

});

app.post("/scrape", function (req, res) {
    request(url, function (err, resp, body) {
        var $ =cheerio.load(body);

        var scrapedHeadlines =$('.headline a');
        // var headlineText = headlines.text();
        var headlines = [];
        for (i=0; i <10; i++) {

            var headline = {
                title: $(scrapedHeadlines[i]).text(),
                link: $(scrapedHeadlines[i]).attr("href")
            }
            headlines.push(headline);
        }

        // var blurb =$('.blurb');
        // var blurbText = blurb.text();

        //  articleText = {
        //     title: headlineText,
        //     link: blurbText
        // } 
        // console.log("Article Text:");
        // console.log(articleText);
        console.log(headlines);
        db.Headline
        .insertMany(headlines)
        // .create(articleText)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));


        // var stringJob = JSON.stringify(articleText);
        // emptyArray.push(stringJob); 
        // //here, add scraped info from website to the mongo database 
        // var newText =(start)+(emptyArray)+(end);
        // console.log("Article Text:");
        // console.log(articleText);
        // res.send(newText);
    });
});

app.get("/", function (req, res) {
    request(url, function (err, resp, body) {
        var $ = cheerio.load(body);
    });
    res.sendFile(path.join(__dirname, "./index.html"));  

});

app.get("/posting", function(req, res){
   // console.log(emptyArray);
   //res.send(emptyArray);
   //res.json(emptyArray);
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



// res.sendFile(path.join(__dirname, "./index.html"));

// $("#btn").click(function(){
//     console.log( "Document ready!" );
//     $("#section").append(job);

// });

// var section = document.getElementById("section");

// //function scrapeNYT() {
// //    document.getElementById("section").innerHTML = "Hello World";
// //}
// //scrapeNYT();

