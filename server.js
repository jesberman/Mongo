
var express = require("express");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var app = express();
var port = 8080;

var url = "https://www.nytimes.com/";



request(url, function (err, resp, body) {
    if (err) {
        console.log(err);
    } else {
        var $ = cheerio.load(body);
        $('.company').filter(function () {
            var companyName = $(this);
            var companyNameText = companyName.text();
        })
        $('.css-1vwlksu e1n8kpgy1').filter(function () {
            var article = $(this);
            var articleText = article.text();
            console.log(articleText);
        })
    }
});


request(url, function (err, resp, body) {

    if (err) {
        console.log(err);
    } else {
        var $ = cheerio.load(body);
        $('.company').filter(function () {
            var companyName = $(this);
            companyNameText = companyName.text();

        })

        $('.css-1vwlksu e1n8kpgy1').filter(function () {
            var article = $(this);
            var articleText = article.text();
            console.log(articleText);
        })

        console.log("ready!");
    }
});



app.listen(port);
console.log("server is listening on port: " + port);
