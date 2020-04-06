var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_URL,
   {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     autoIndex: process.env.MONGODB_AUTO_INDEX,
     useCreateIndex:true
    }
);

var db = mongoose.connection;

// Various Models
var User = require('./models/userModel');

// TODO  Log Error and handling mechanism
db.on('error', console.error.bind(console, 'connection error:'));

// TODO Log
db.once('open', function() {
  // we're connected!
  console.log("Database Connected");
});


module.exports = db;
