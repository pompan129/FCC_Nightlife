const path = require('path');
const https = require('https');
const axios=require('axios');
const passport = require('passport');
const PassportStrategies = require("./auth-strategies");
var mongoose = require ("mongoose");
const Authenticate = require("./authenticate");
const Business = require("./models/business");

const authenticateLocal = passport.authenticate('local', { session: false });
const authenticateJWT = passport.authenticate('jwt', { session: false });

module.exports = function(app){

  app.get('/api/businesses/getall',(req,resp)=>{
    let {location, term} = req.query
      console.log("token>>",  process.env.YELP_TOKEN);// TODO:
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
      console.log("/api/businesses/getall     > ",response.data.businesses);
      const yelpBusinesses = response.data.businesses;
      const yelpBusinessNames = yelpBusinesses.map((value)=>{return value.id});
        console.log(yelpBusinessNames);//todo
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

  app.post('/api/user/signup', Authenticate.signup);

  app.post('/api/user/signin', authenticateLocal, Authenticate.signin);

  app.post('/api/business/modify',(req,resp,next)=>{
    console.log("api/business/modify",req.body);//todo
    const busid = req.body.busid;
    const user = req.body.user;

    if(!busid || !user){return next(new TypeError('inValid Business ID or username ' + busid + "  " + user ));}

    Business.findOne({busid:busid},function(err,business){
      if(err){return next(err);}

      //if business in DB modify list of people going to business
      if(business){
        console.log("business found ", business);//todo

        //if user exists in list remove them
        if(business.going.includes(user)){
          console.log("user going",  business.going);//todo
          business.going = business.going.filter(item=>item != user);
          console.log("user going(2)",  business.going);//todo
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

  app.get('/api/businesses/attending',(req,resp)=>{
      const  {businesses} = req.query;
      console.log("attending>>",  businesses);// TODO:

    })



}
