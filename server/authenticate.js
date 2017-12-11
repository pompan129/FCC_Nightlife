const User = require("./models/user");
const jwt = require("jwt-simple");

getToken = function(payload){
  const token = jwt.encode({username:payload.username}, process.env.SECRET );
  return token;
}

exports.getToken = getToken;

exports.signup = function(req, res, next){
    console.log("exports.signup===========",req.body);//todo
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
      return res.status(422).send({error:"you must provide a username and password"})
    }

    User.findOne({username:username},function(err,exists){
      if(err){return next(err);}
      if(exists){
        console.log("error: USER EXISTS");//todo
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
