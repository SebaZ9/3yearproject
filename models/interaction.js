const mongoose = require("mongoose");

const interactionSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    device_id : mongoose.Schema.Types.ObjectId,
    user_id : String,
    turn_on : Date,
    turn_off : Date,
    powerused : Number
});

module.exports = mongoose.model("Interaction", interactionSchema);