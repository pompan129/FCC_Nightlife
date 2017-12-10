const path = require('path');
const https = require('https');
const axios=require('axios');
const request = require('request'); //to make 0auth requests
const passport = require('passport');//todo
const PassportStrategies = require("./auth-strategies");
var mongoose = require ("mongoose");
const Authenticate = require("./authenticate");
const Business = require("./models/business");
const getToken = require ('./authenticate').getToken;


const authenticateLocal = passport.authenticate('local', { session: false });
const authenticateJWT = passport.authenticate('jwt', { session: false });

module.exports = function(app){

  app.get('/api/businesses/getall',(req,resp)=>{
    let {location, term} = req.query

    axios.get("https://api.yelp.com/v3/businesses/search",{
      headers: {
        authorization: "Bearer " + process.env.YELP_TOKEN ,
        "Content-Type": "application/json"
      },
      params:{
        term:term,
        location:encodeURI(location)
      }
    })
    .then((response)=>{
      const yelpBusinesses = response.data.businesses;
      const yelpBusinessNames = yelpBusinesses.map((value)=>{return value.id});

      Business.find({busid:{$in:yelpBusinessNames}},(e,r)=>{
          businessesWithGoingField = yelpBusinesses.map((value)=>{
            value.going = [];
             const goingBusiness = r.find((v)=>{
               return v.busid == value.id;
             })
             if(goingBusiness){value.going = goingBusiness.going;}
             return value;
          })
          resp.send(businessesWithGoingField);
        })
    })
    .catch((error)=>{
        console.log(error.message,Object.keys(error),error.response.status);
        resp.send({error:true , message:error.message, status:error.response.status});
    })
  });

  app.post('/api/auth/twitter',
    (req,resp,next)=>{

      request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;
        next();
      });
    },
    passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
     if (!req.user) {
       return res.send(401, 'User Not Authenticated');
     }

     res.setHeader('x-auth-token', getToken({username:req.user.username}));
     return res.status(200).json({username:req.user.username});
   }
  );

  app.post('/api/auth/twitter/reverse',(req,resp)=>{

    //get auth token & scret from twitter
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key:  process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      //send oauth_token & oauth_token_secretjson back to client as json
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      resp.send(JSON.parse(jsonStr));
    });
  });

  app.get('/api/auth/refresh/jwt',authenticateJWT,(req,resp)=>{
    resp.send({msg:"success", username:req.user.username});
  })

  app.get('/api/auth/jwt',authenticateJWT,(req,resp)=>{
    resp.send({msg:"testJWT"});//todo - make loging into business a protected route
  })

  app.post('/api/user/signup', Authenticate.signup);

  app.post('/api/user/signin', authenticateLocal, Authenticate.signin);

  app.post('/api/business/modify',(req,resp,next)=>{
    const busid = req.body.busid;
    const user = req.body.user;

    if(!busid || !user){return next(new TypeError('inValid Business ID or username ' + busid + "  " + user ));}

    Business.findOne({busid:busid},function(err,business){
      if(err){return next(err);}

      //if business in DB modify list of people going to business
      if(business){

        //if user exists in list remove them
        if(business.going.includes(user)){
          business.going = business.going.filter(item=>item != user);
        }
        //if user not in list add them to list
        else{business.going.push(user);}

        //save business w/ new list of attendees
        business.save(function(err){
          if(err){return next(err);}
          return resp.json({success:true,busid:busid, going:business.going})
        })

      }
      //if business not in DB add it & user
      else{
        const newBusiness = new Business({
          busid: busid,
          going:[user]
        })

        newBusiness.save(function(err){
            if(err){return next(err);}

            resp.json({success:true,busid:busid,going:newBusiness.going})
        })
      }
    })
  });

  /*app.get('/api/businesses/attending',(req,resp)=>{//TODO what is this???
      const  {businesses} = req.query;
    })*/

}
