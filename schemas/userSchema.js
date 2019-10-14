let user = {
  "$schema": "http://json-schema.org/draft-07/schema#",
     "properties":{
     	"mail": {
            "format": "email"
         },
         "name": {
         	"type": "string",
         },
         "surname": {
         	"type": "string",
         },
         "login": {
           "type": "string",
           "minLength": 6,
           "maxLength": 16
         },
         "pwd":{
         	"type": "string",
            "minLength": 6,
            "maxLength": 24,
         },
         "dob":{
         	"format": "date"
         },
         "phone":{
         	"type": "string",
            "length": 10
         },
     }
 };

 module.exports = user;