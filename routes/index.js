const express = require('express');
const router = express.Router();
const Ajv = require('ajv');
const ajv = new Ajv();
const usersSchema = require('../schemas/userSchema');
const UserModel = require("../models/userModel");

router.get('/', function(req, res, next) {
  UserModel.find()
  .then(data=>{
    res.render('index', {users: data});
  })
  .catch(err=>{if(err) throw err});
});
router.post('/', (req,res)=>{
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
    new_user.save();
    res.redirect('/');
  }
})

module.exports = router;
