const User = require("./models/user");
const jwt = require("jwt-simple");

const getToken = function(payload){
  return jwt.encode(payload, process.env.SECRET );
}


exports.signup = function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
      return res.status(422).send({error:"you must provide a username and password"})
    }

    User.findOne({username:username},function(err,exists){
      if(err){return next(err);}
      if(exists){
        console.log("erorr: USER EXISTS");//todo
         res.status(422);
          return  res.send({ error: 'Email is in use' });
      }

      const newUser = new User({
        username: username,
        password: password
      })

      newUser.save(function(err){
          if(err){return next(err);}

          res.json({success:true, token: getToken(newUser),username:newUser.username})
      })
    })
}

exports.signin = function(req, res, next){
  res.json({success:true, token: getToken(req.user),username:req.user.username})
}
