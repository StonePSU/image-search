const mongo = require('mongodb').MongoClient;
const moment = require('moment');
//var dbURL = 'mongodb://localhost:27017/image-search';
//var dbURL = 'mongodb://admin:abc123@ds127399.mlab.com:27399/stonepsu-imagesearch'
var dbURL = process.env.MONGOLAB_URL;
var _db;

mongo.connect(dbURL, (err, db)=> {
    if (err) throw err;
    _db = db;
});

var myDB = function() {};

myDB.prototype.addTerm = function(term) {
    console.log(`Adding new search term to database: ${term}`);
    var h = _db.collection('history');
    
    h.insert({
        "search-term": term, 
        "date-searched": moment().format('YYYY-MM-DD HH:MM:SS')
    });
}

myDB.prototype.getRecent = function(num, callback) {
    var h = _db.collection('history');
    var retVal;
    
    // need to sort by $natural:-1 which returns records in the order which they were inserted (-1 reverses the order giving us the last insert first
    h.find({}, {_id: 0, "search-term": 1, "date-searched": 1}).limit(num).sort({$natural: -1}).toArray(function(err, results) {
        
        if (err) throw err;
        
        if (results.length < 1) {
            retVal = {
               "No Results": "No recent history was found."
            }
        } else {
            retVal = results;
        }
        // res.json(retVal);
        
        // Execute the callback function to do something with the results of the query
        callback(retVal);
    });
    
}

// If the process terminates, close the connection with mongo otherwise there can be database corruption.
process.on('SIGINT',function() {
    _db.close();
    console.log("Closing connection to MongoDB.");
    process.exit(0);
} );

module.exports = new myDB();

