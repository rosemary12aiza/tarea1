const mongoose = require("./connect");
var USERSCHEMA ={
    name         : String,
    email        : String,
    password     : String,
    registerdate : Date,
    sexo         : String,
    address      : String
}
const USERS = mongoose.model("users", USERSCHEMA);
module.exports = {model: USERS, schema: USERSCHEMA};
