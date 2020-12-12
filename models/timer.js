const mongoose = require("mongoose");

const timerSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    device_id : mongoose.Schema.Types.ObjectId,
    startdate : Date,
    enddate : Date
});

module.exports = mongoose.model("Timer", timerSchema);