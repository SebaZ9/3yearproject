const mongoose = require("mongoose");

const solardataSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    year : Number,
    month : Number,
    data : [Number]
});

module.exports = mongoose.model("SolarData", solardataSchema);