const express = require('express');
const app = express();
var bodyParser = require("body-parser");
const path = require('path');
const Routes = require("./server/routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
if (process.env.NODE_ENV === 'production') {
  console.log(">>>(process.env.NODE_ENV === 'production'");
  //app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(express.static('client/build'));//TODO

  app.get('/^(?!api$)/', function (req, res) {
    console.log("call to home>>>>>>>>>>>>",__dirname);
    res.sendFile(path.join(__dirname,'client/build', 'index.html'));
  });
}else{
  console.log(">>>(process.env.NODE_ENV !== 'production'");
  app.use(express.static(path.join(__dirname, 'client/public')));

  app.get('/', function (req, res) {
    console.log("call to home");
    res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
  });
}
*/


//set up database
var mongoose = require('mongoose');
//mongodb://<dbuser>:<dbpassword>@ds157571.mlab.com:57571/heroku_mrcz13gs
//*****mongodb://<dbuser>:<dbpassword>@ds259855.mlab.com:59855/nightlife
console.log("connecting to mongoDB");// we're connected!
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds259855.mlab.com:59855/nightlife`);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongoDB");// we're connected!
});

Routes(app);

if (process.env.NODE_ENV === 'production') {
  console.log(">>>(process.env.NODE_ENV === 'production'");
  //app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(express.static('client/build'));//TODO

  app.get('/*', function (req, res) {
    console.log("call to home>>>>>>>>>>>>",__dirname);
    res.sendFile(path.join(__dirname,'client/build', 'index.html'));
  });
}else{
  console.log(">>>(process.env.NODE_ENV !== 'production'");
  app.use(express.static(path.join(__dirname, 'client/public')));

  app.get('/', function (req, res) {
    console.log("call to home");
    res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
  });
}



app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
