const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
mongoose.set('useFindAndModify', false);

const InteractionData = require("../models/interaction");
const SolarData = require("../models/solardata");
const Room = require("../models/rooms");
const Climate = require("../models/climate");
const Stats = require("../models/stats");

// db.solardatas.aggregate([ {$project: {powerproduction : 1, month : {$month : "$date"}, day : {$dayOfMonth: "$date"} }}, {$match:{ month : 02}} ])
//query

router.post("/interactionupdate", (req,res) => {
    InteractionData.findOneAndUpdate({"device_id" : req.body.device_id}, {"turn_off" : Date.now()}, {new : true, upsert : true}).sort({turn_on : -1})
    .exec()
    .then( doc => {
        console.log("Updated interaction");
        res.status(200).json(doc);
    })
    .catch( err => {
        res.status(500).json({error : err});
    });
});

router.post("/interaction", (req, res) => {
    const interactionData = new InteractionData({
        _id : new mongoose.Types.ObjectId(),
        device_id : req.body.device_id,
        user_id : req.body.name,
        turn_on : Date.now(),
        turn_off : Date.now(),
        powerused : -1
    });
    interactionData.save()
    .then( doc => {
        console.log("new interaction: "),
        res.status(200).json(doc);
    })
    .catch( err => {
        res.status(500).json({error : err});
    });
});


router.get("/interaction/:id", (req, res) => {
    InteractionData.find({"device_id" : req.params.id}).sort({turn_on : -1})
    .exec()
    .then( doc => {
        res.status(200).json(doc);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

router.get("/solardata", (req, res) => {
    SolarData.find({})
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

router.get("/solardata/:year", (req, res) => {
    var year = parseInt(req.params.year);
    console.log("GEt data from year: " + year)
    SolarData.find({ 'year' : year })
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});


router.post("/solardata/:year/:month/:data", (req, res) => {
    var year = req.params.year;
    var month = req.params.month;
    var power = req.params.data;

    res.send({res : AddSolarData(year, month, power)});

});

 let AddSolarData =  function (year, month, data){
    console.log("Add solar data");    

    const filter = {
        'year' : parseInt(year),
        'month' : parseInt(month)
    }
    const update = { $push: { 'data' : parseInt(data) } }

    console.log(update)

    SolarData.findOneAndUpdate(filter, update, {new : true, upsert : true})
    .exec()
    .then( data => {
        return data;
    })
    .catch( err => {
        return err;
    })
}

router.get("/rooms", (req, res) => {
    Room.find({})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({err: err});
    })
});

router.post("/rooms", (req, res) => {
    const room = new Room({
        "_id" : new mongoose.Types.ObjectId(),
        "roomName" : req.body.room
    });

    room.save()
    .then(data => {        
        console.log("Added new room: " + req.body.room);
        res.sendFile(path.join(__dirname + "./../views/Settings.html"));
    })
    .catch(err => {
        console.log(err);
        res.sendFile(path.join(__dirname + "./../views/index.html"));
    })
});

router.get("/roomexists/:room", (req,res) => {
    console.log("Checking if room already exists: " + req.params.room);
    Room.find({ roomName : req.params.room })
    .then( data => {
        var exists = data.length == 0 ? false : true;
        res.send({ exists : exists });
    })
    .catch( err => {
        console.log(err)
        res.status(500).send({ err : err });
    });
});

router.post("/deleteroom/:id", (req,res) => {
    console.log("Deleteing a room with id: " + req.params.id);
    Room.findByIdAndDelete(req.params.id)
    .exec()
    .then( data => {
        console.log(data);
        res.send({ ok : true });
    })
    .catch( err => {
        console.log(err);
        res.status(500).send({ err : err });
    });
})

//Climate Routes
router.get("/climateget", (req, res) =>{
    Climate.find({})
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

router.get("/getclimate/:id", (req, res) => {
    console.log("Request climate info with ID: " + req.params.id);
    Climate.findById(req.params.id)
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({err : err});
    })
});

router.post("/climatetest", (req, res) => {
    const cc = new Climate({
        "_id" : new mongoose.Types.ObjectId(),
        "climateDevice" : "AC",
        "poweruse" : 60,
        "status" : false,
        "monday" : {
            "on" : req.body.monOn,
            "off" : req.body.monOff
        },
        "tuesday" : {
            "on" : req.body.tuesOn,
            "off" : req.body.tuesOff
        },
        "wednesday" : {
            "on" : req.body.wedOn,
            "off" : req.body.wedOff
        },
        "thursday" : {
            "on" : req.body.thurOn,
            "off" : req.body.thurOff
        },
        "friday" : {
            "on" : req.body.friOn,
            "off" : req.body.friOff
        },
        "saturday" : {
            "on" : req.body.satOn,
            "off" : req.body.satOff
        },
        "sunday" : {
            "on" : req.body.sunOn,
            "off" : req.body.sunOff
        }
    });
    cc.save()
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.send(err);
    })
});

router.post("/updateclimate", (req,res) => {
    console.log("Update climate");
    const options = {
        "monday" : {
            "on" : req.body.monOn,
            "off" : req.body.monOff
        },
        "tuesday" : {
            "on" : req.body.tuesOn,
            "off" : req.body.tuesOff
        },
        "wednesday" : {
            "on" : req.body.wedOn,
            "off" : req.body.wedOff
        },
        "thursday" : {
            "on" : req.body.thurOn,
            "off" : req.body.thurOff
        },
        "friday" : {
            "on" : req.body.friOn,
            "off" : req.body.friOff
        },
        "saturday" : {
            "on" : req.body.satOn,
            "off" : req.body.satOff
        },
        "sunday" : {
            "on" : req.body.sunOn,
            "off" : req.body.sunOff
        }
    }
    Climate.findByIdAndUpdate(req.body._id, options)
    .exec()
    .then( data => {
        console.log(data);
        res.send({ ok : data });
    })
    .catch( err => {
        console.log(err);
        res.status(500).send({ err : err });
    });
})

router.post("/climateToggle/:id/:status", (req, res) => {
    console.log("Toggling climate to :" + req.params.status);
    var update;
    if(req.params.status == 1) { update = true } else { update = false; }
    Climate.findOneAndUpdate({"_id" : req.params.id}, {"status" : update }, {new : true, upsert : true})
    .exec()
    .then(doc => {
        res.status(200).json({ok:true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
});

module.exports = router;
module.exports.SolarData = AddSolarData;