const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const Devices = require("../models/devices");

router.post("/devicesadd", (req, res) => {
    console.log("Recieved add.");
    const device = new Devices({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        grouping : req.body.grouping,
        powerusage : req.body.powerusage,
        status : false,
    });
    console.log(device);
    device.save()
    .then( doc => {
        console.log(doc);
        res.status(200).json(doc); 
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({error : err});
    });
});

router.post("/devicetoggle/:id/:status", (req, res) => {
    console.log("Changing device: " + req.params.id + " is now " + req.params.status);
    var update;
    if(req.params.status == 1) { update = true } else { update = false; }
    Devices.findOneAndUpdate({"_id" : req.params.id}, {"status" : update }, {new : true, upsert : true})
    .exec()
    .then(doc => {
        res.status(200).json({ok:true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

let ScheduleDevice = function(id,status){
    Devices.findById(id)
    .exec()
    .then( data => {
        if(status != data.status){
            Devices.findOneAndUpdate({"_id" : id}, {"status" : status }, {new : true, upsert : true})
            .exec()
            .then(doc => {
                console.log("Turn device " + data.name + " " + status + " with scheduling");
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
    .catch(err => {
        console.log(err);
    })
}

router.post("/devicesremove/:id", (req, res) => {
    console.log("Removing device.");
    console.log(req.params.id);
    Devices.findByIdAndRemove(req.params.id)
    .exec()
    .then(doc => {
        res.status(200).json({ok:true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

router.get("/devicesget", (req, res) =>{
    Devices.find({})
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

module.exports = router;
module.exports.schedule = ScheduleDevice;