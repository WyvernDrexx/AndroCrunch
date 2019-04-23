const passportLocalMongoose = require("passport-local-mongoose"), 
    mongoose                = require("mongoose"),
    moment                  = require("moment"),
    userSchema              = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema); //We return the model rather than the Schema
module.exports = User;