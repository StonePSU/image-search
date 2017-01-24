const got = require('got');

var url = "https://www.googleapis.com/customsearch/v1?";
var cx = process.env.GOOGLE_CX;
var APIKey = process.env.GOOGLE_APIKEY;

var search = function() {};

search.prototype.performSearch = function(term, start, cb) {
    var s="&start=" + start;
    
    var apiURL = url + "&cx=" + cx + "&key=" + APIKey + "&q=" + term + "&num=10" + "&searchType=image" + s;

    got(apiURL, {json: true}).then(res=> {
        var results = res.body.items;
        var retVal = [];
        if (results.length > 0) {

            retVal = results.map(function(item) {
                return {
                    "page-url": item.image.contextLink,
                    "alt-text": item.snippet,
                    "image-url": item.link
                    
                }
            });
        }
        
        cb(retVal);
        
    })
}

module.exports = new search();