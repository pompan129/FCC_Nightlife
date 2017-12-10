const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("./models/user");
const TwitterTokenStrategy = require('passport-twitter-token');
const config = require('./envVars');


//passport strategies
passport.use(new TwitterTokenStrategy({
      consumerKey: '2VVu4jwpQtrKIG7hX6qJOhgCP',
      consumerSecret: 'bOfqtuMKH7hnoPaGfu6z4xrANFcNuoXXoBgXyrhYJI4iFdkLFs'
    },
    function (token, tokenSecret, profile, done) {
      User.findOne({username:profile.username.toLowerCase()},function(err,user){
        if(user){
          console.log("USER EXISTS");//todo
          return done(err,user);
        }

        const newUser = new User({
          username: profile.username
        })

        newUser.save(function(err,newUser){
            if(err){console.log(err);}
            return done(err,newUser);
        })
      })
    }));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username/password.' });
      }

      user.comparePassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (!isMatch) {
          return done(null, false,{ message: 'Incorrect username/password.' });
        }
        return done(null, user);
      });
    });
  }
));


const jwtStrategyOptions = {
  jwtFromRequest:ExtractJwt.fromAuthHeaderWithScheme("Bearer"), //ExtractJwt.fromHeader("Authorization"),
  secretOrKey: process.env.SECRET
};

passport.use(new JwtStrategy(jwtStrategyOptions, function(jwt_payload, done) {
      User.findOne({ username: jwt_payload.username }, function (err, user) {
      if (err) { return done(err); }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }));
