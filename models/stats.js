const mongoose = require("mongoose");

const statsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    device_id : mongoose.Schema.Types.ObjectId,
    month : Number,
    day : Number,
    power : Number
});

module.exports = mongoose.model("Stats", statsSchema);