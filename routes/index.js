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
  // looking for a loginning user in DB,
  // and doing some king of validation
  UserModel.findOne(lUser)
  .then((data)=>{
   if(data) {
    if(req.body.login === data.login){
      // the PROBLEM with the next stroke
      if(lUser.comparePwd(lUser)) {
          res.render('index', {title: data.username});
      } else {
          res.render('index', {err: 'Login or password is incorrect!'});
      }
    } else {
        res.render('index', {err: 'Login or password is incorrect!'});
    }
   }else {
    res.send('lox');
   }
  })
  .catch(err=>{if(err) throw err});
  
});
// POST route to work with registration
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
    const new_user = new UserModel({
      mail: req.body.mail,
      name: req.body.name,
      surname: req.body.surname,
      login: req.body.login,
      pwd: req.body.pwd,
      dob: req.body.dob,
      phone: req.body.phone,
    });
    // next stroke is reversing password, to save it in DB lol
    new_user.pwd = new_user.reversePwd();
    new_user.save();
    res.redirect('/');
  }
})

module.exports = router;
