const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
mongoose.set('useFindAndModify', false);

const Timer = require("../models/timer");

router.post("/timer", (req, res) => {
    console.log(req.body);
    const {
        device_id, start, end
    } = req.body
    console.log("Adding timer: From " + start +" to "+ end);

    const timer = new Timer({
        _id : new mongoose.Types.ObjectId(),
        device_id : device_id,
        startdate : start,
        enddate : end
    });
    timer.save()
    .then(data => {
        console.log("Added timer to DB");
        res.send({ok:true});
    })
    .catch(err => {
        console.log(err);
        res.send({error:err});
    })
});

router.get("/timerid/:id", (req, res) => {
    console.log("Request timer info " + req.params.id);
    Timer.find({"device_id" : req.params.id})
    .then( data => {
        console.log(data)
        res.send(data);
    })
    .catch( err => {
         res.status(500).send({err : err});
    })
});


let getAllSchedules = async function(){
    return await Timer.find({})
    .then( data => {
        return data;
    })
    .catch( err => {
        return err;
    })     
}

let removeSchedule = function(id){
    Timer.findByIdAndDelete(id)
    .exec()
    .then( data => {
        console.log("Deleted Schedule with ID: " + id);
    })
    .catch( err => {
        console.log(err);
    })
}

router.post("/timerTest/:id/:on/:off", (req, res) => {
    var device_id = req.params.id
    var timeOn = req.params.on
    var timeOff = req.params.off
    console.log("Turn " + device_id + " on at " + timeOn + " and off at " + timeOff)

    const timer = new Timer({
        _id : new mongoose.Types.ObjectId(),
        "device_id" : device_id,
        "startdate" : timeOn,
        "enddate" : timeOff
    });
    timer.save()
    .then(data => {
        console.log("Added timer to DB");
        res.send({ok:true});
    })
    .catch(err => {
        console.log(err);
        res.send({error:err});
    })
});

module.exports = router;
module.exports.AllSchedules = getAllSchedules;
module.exports.dSchedule = removeSchedule;