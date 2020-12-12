const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    fname : String,
    lname : String,
    username : String,
    password : String,
    admin : Boolean
});

module.exports = mongoose.model("Account", accountSchema);