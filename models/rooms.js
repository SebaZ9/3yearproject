const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    roomName : String
});

module.exports = mongoose.model("Room", roomSchema);