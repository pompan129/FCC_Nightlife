const path = require('path');
const passport = require('passport');
const PassportStrategies = require("./auth-strategies");
var mongoose = require ("mongoose");
const Authenticate = require("./authenticate");
var Poll = require("./models/poll-model");//Poll model for mongodb/mongoose

const authenticateLocal = passport.authenticate('local', { session: false });
const authenticateJWT = passport.authenticate('jwt', { session: false });

module.exports = function(app){


  app.get('/api/businesses/getall',(req,resp)=>{
    const {location, term} = req.query

    https.get({
      headers: {
        authorization: "Bearer _PXZ4li7aIZt09837B5bNFQeZfJ354URKKF12VJYN-olqP9Apzs4ExK0Ej8bD1yl0ZdEsa8panPu8A0cXtOxly0oazfaYZOafcVpvBDbbOJqLfhv9JEix7Lu5rYkWXYx",
        "Content-Type": "application/json"
      },
      hostname :"api.yelp.com",
      path:`/v3/businesses/search?term=${term}&location=${location}&radius=9000&limit=25`  //todo set limit and variable for location& term
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
          console.error(error.message,res.data);
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

  app.post('/api/user/signup', Authenticate.signup);

  app.post('/api/user/signin', authenticateLocal, Authenticate.signin);


  /*app.get('/*', function (req, res) {
    console.log("app.get('/*', function (req, res) {", __dirname)
   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
 });*/

}
