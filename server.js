const express = require('express');
const app = express();
var bodyParser = require("body-parser");
const path = require('path');
const https = require('https');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}else{
  app.use(express.static(path.join(__dirname, 'client/public')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
  });
}

app.get('/api/activites/getall',(req,resp)=>{
  const {location, term} = req.query

  https.get({
    headers: {
      authorization: "Bearer _PXZ4li7aIZt09837B5bNFQeZfJ354URKKF12VJYN-olqP9Apzs4ExK0Ej8bD1yl0ZdEsa8panPu8A0cXtOxly0oazfaYZOafcVpvBDbbOJqLfhv9JEix7Lu5rYkWXYx",
      "Content-Type": "application/json"
    },
    hostname :"api.yelp.com",
    path:`/v3/businesses/search?${term}=bar&location=${location}&radius=9000&limit=25`  //todo set limit and variable for location& term
  },(res)=>{
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type.\n` +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          //console.log(parsedData);
          resp.send(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    })
})



app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
