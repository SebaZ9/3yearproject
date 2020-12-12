const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
mongoose.set('useFindAndModify', false);

const Stats = require("../models/stats");

router.get("/getstat/:id", (req, res) => {
    var query = {
        'device_id' : req.params.id
    };
    Stats.find(query)
    .exec()
    .then( data => {
        console.log(data)
        res.send(data);
    })
    .catch( err => {
        res.send(err);
        console.log(err)
    })
})

router.get("/getstat", (req, res) => {
    Stats.find({})
    .exec()
    .then( data => {
        console.log(data)
        res.send(data);
    })
    .catch( err => {
        res.send(err);
        console.log(err)
    })
})

router.post("/newstat/:id/:month/:day/:power", (req, res) => {
    var query = {
        'device_id' : req.params.id,
        'month' : req.params.month,
        'day' : req.params.day,
    }
    var update = { $push : { 'power' : req.params.power} }
    Stats.findOneAndUpdate(query, update)
    .exec()
    .then( data => {
        if(data == null){
            const stat = new Stats({
                _id : new mongoose.Types.ObjectId(),
                device_id : req.params.id,
                month : req.params.month,
                day : req.params.day,
                power : req.params.power
            });
            stat.save()
            .then( data => {
                console.log(data);
                res.send(data);
            })
            .catch( err => {
                console.log(err);
                res.send(data);
            })
        }else{
            res.send(data);
        }
    })
    .catch( err => {
        console.log(err);
        res.send(data);
    })
});

module.exports = router;