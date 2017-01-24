const express = require('express');
const db = require('./db.js');
var app = express();
const search = require('./search.js');

app.use(express.static("./public_html"));

app.get("/api/imagesearch/:term", function(req, res) {
   var term = req.params.term;
   var offset = "1";
   
   var writeResponse = function(results) {
      res.send(results);
   }; 
   
   // Add search term to the database
   db.addTerm(term);

   if (req.query.offset && !isNaN(req.query.offset)) {
     offset = req.query.offset;   
   } 
   
   search.performSearch(term, offset, writeResponse);
});

app.get("/api/history/imagesearch/", function(req, res) {
   
   // call back function that will write the results of the query in the response
   var writeResponse = function(results) 
      { 
         res.json(results); 
         
      }
   
   // get the most recent results
   db.getRecent(20, writeResponse);
});


app.get("/", function(req, res) {
   res.sendFile(__dirname + "/public_html/index.html") ;
});

app.listen(process.env.PORT || 8080);
console.log("Server is running");
