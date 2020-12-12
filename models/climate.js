const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    climateDevice : String,
    poweruse : Number,
    status : Boolean,
    monday : {
        on : Number,
        off : Number
    },
    tuesday : {
        on : Number,
        off : Number
    },
    wednesday : {
        on : Number,
        off : Number
    },
    thursday : {
        on : Number,
        off : Number
    },
    friday : {
        on : Number,
        off : Number
    },
    saturday : {
        on : Number,
        off : Number
    },
    sunday : {
        on : Number,
        off : Number
    }
});

module.exports = mongoose.model("Climate", accountSchema);