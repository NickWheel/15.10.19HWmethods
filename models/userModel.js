const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    mail: String,
    name: String,
    surname: String,
    login: String,
    pwd: String,
    dob: Date,
    phone: String, 
});
// DB method hashing user`s pwd
UserSchema.methods.hashingPwd = async function(password){
    let hash = await bcrypt.hash(password, saltRounds);
    return hash;
}
// DB method compares entered pwd with existing user`s hashed pwd.
// It compares registered user's hash with pwd that comes from "logining" form.
// The method must be used on user that IS ALREADY IN DB, not on
// a user that trying to log in. 
UserSchema.methods.comparePwd = async function(loggining_pwd){
    let isItOk = await bcrypt.compare(loggining_pwd, this.pwd);
    return isItOk;
};
// DB method converts original pwd to reversed pwd
UserSchema.methods.reversePwd = function(){
    let splitString = this.pwd.split("");
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join("");
    return joinArray;
};



const Model = mongoose.model('User', UserSchema);
module.exports = Model;