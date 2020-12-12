const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    grouping : String,
    powerusage : Number,
    status : Boolean
});

module.exports = mongoose.model("Devices", deviceSchema);