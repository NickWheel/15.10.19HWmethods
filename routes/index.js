const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const ajv = new Ajv();
const usersSchema = require('../schemas/userSchema');
const UserModel = require("../models/userModel");

// main page route
router.get('/', function(req, res, next) {
  UserModel.find()
  .then(data=>{
    res.render('index', {users: data});
  })
  .catch(err=>{if(err) throw err});
});

// LOGIN route
router.post('/login', (req,res)=>{
  const lUser = {
    login: req.body.login,
    pwd: req.body.pwd
  };
  // looking for a loginning user in DB
  UserModel.findOne({login: lUser.login})
  .then((data)=>{
    let result = data.comparePwd(lUser.pwd);
    if(result) {
      res.cookie('hash', `${data.pwd.match(/.{1,5}/)}`).cookie('login', `${data.login}`)
      .end('You are logged in!');
    }else {
      res.send('Login or password is incorrect!');
    }
  })
  .catch(err=>{if(err) throw err});
  
});

// REGISTRATION route
router.post('/', (req,res)=>{
  // validation
  const validate = ajv.compile(usersSchema);
  const valid = validate(req.body);
  console.log('VALIDATION: '+valid);

  if (!valid) {
    const { errors } = validate;
    const result = {
      status: 'you are invalid',
    };
    console.log(errors);
    res.json(result);
  }
  // if new user passed validation, he will be saved in DB
  else {
    // hashing the pwd 
     (async function(){
      const new_user = await new UserModel({
        mail: req.body.mail,
        name: req.body.name,
        surname: req.body.surname,
        login: req.body.login,
        dob: req.body.dob,
        phone: req.body.phone,
      });
      let hashedPwd = await new_user.hashingPwd(req.body.pwd);
      new_user.pwd = hashedPwd;
      await new_user.save();
      res.redirect('/');
    })();
  }
})

module.exports = router;
