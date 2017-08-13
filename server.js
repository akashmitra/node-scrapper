(function () {
    'use strict';

    var express = require('express');
    var fs = require('fs');
    var request = require('request');
    var cheerio = require('cheerio');
    var app = express();
    var http = require('http').Server(app);
    var port = process.env.PORT || 8080;


    app.get('/scrape', function (req, res) {

        var url = 'http://www.imdb.com/title/tt1229340/';

        /**
         * The structure of our request call
         * The first parameter is our URL
         * The callback function takes 3 parameters, an error, response status code and the html
         */
        request(url, function (error, response, html) {
            var json = { title: "", release: "", rating: "" };

            if (!error) {
                var $ = cheerio.load(html);
                var title, release, rating;

                $('h1[itemprop="name"]').filter(function () {
                    var data = $(this);
                    title = data.text().trim();
                    release = data.children().last().children().text();
                    json.title = title;
                    json.release = release;
                });

                $('.ratingValue').filter(function () {
                    var data = $(this);
                    rating = data.children().children().text();
                    json.rating = rating;
                });
            }

            /**
             * To write to the system we will use the built in 'fs' library.
             * In this example we will pass 3 parameters to the writeFile function
             * Parameter 1 :  output.json - this is what the created filename will be called
             * Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
             * Parameter 3 :  callback function - a callback function to let us know the status of our function
             */
            fs.writeFile('output.json', JSON.stringify(json, null, 4), function () {
                console.log('File successfully written! - Check your project directory for the output.json file');
            });

            // Send out a message to the browser
            res.send('Check your console!');

        }); //End of Request

    }); // End of app.get


    http.listen(port, function () {
        console.log('Magic happens on port 8080 ::' + port);
    });

}());