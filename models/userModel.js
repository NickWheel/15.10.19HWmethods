const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    mail: String,
    name: String,
    surname: String,
    login: String,
    pwd: String,
    dob: Date,
    phone: String, 
});
UserSchema.methods.comparePwd = function(){
    if(req.body.pwd === this.model("User")) {
        console.log('pwd is allright!');
        return true;
    }
    else {
        console.log('pwf is fucked up!');
        return false;
    }
};
UserSchema.methods.reversePwd = function(){
    let splitString = this.pwd.split("");
    let reverseArray = splitString.reverse();
    let joinArray = reverseArray.join("");
    return joinArray;
}

const Model = mongoose.model('User', UserSchema);
module.exports = Model;