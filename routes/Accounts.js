const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require("path");
mongoose.set('useFindAndModify', false);

const Account = require("../models/account");

/* Send user to main page */
router.get("/home", (req, res) => {
    console.log("Home page. ID: " + req.session.uID + " : " + req.session.admin);
    res.sendFile(path.join(__dirname + './../views/index.html'));
});

/* Sends user to register page */
router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + "./../views/signup.html"));
});

/* Send user to login page */
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + "./../views/login.html"));
});

/* Request information about an account with the current session */
router.get("/accountinfo", (req, res) => {
    console.log("Request acc info: " + req.session.uID);
    if(req.session.uID){
        Account.findById(req.session.uID)
        .then( data => {
            res.send(data);
        })
        .catch( err => {
            res.status(500).send({err : err});
        })
    }else{
        res.send({accountType : "guest"});
    }
});

/* Request information about an account with the an id */
router.get("/getaccount/:id", (req, res) => {
    console.log("Request acc info: " + req.params.id);
    Account.findById(req.params.id)
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({err : err});
    })
});

/* Handles the register request */
router.post("/register", (req, res) => {
    const {
        fname, lname, username, password
    } = req.body
    console.log("Register Request: " + username + " : " + password);

    const account = new Account({
        _id : new mongoose.Types.ObjectId(),
        fname : fname,
        lname : lname,
        username : username,
        password : password,
        admin : false
    });

    account.save()
    .then(data => {
        console.log("Added user to DB");
        req.session.uID = account._id;
        req.session.admin = account.admin;
        res.sendFile(path.join(__dirname + "./../views/Settings.html"));
    })
    .catch(err => {
        console.log(err);
        res.redirect("/register");
    })

});

/* Handles the login request */ 
router.post("/login", (req, res) => {
    console.log("Login Request: " + req.body.username + " : " + req.body.password);
    Account.find({
        username : req.body.username,
        password : req.body.password
    })
    .then(data => {
        console.log(data);
        if(data.length == 0){
            console.log("No Data");
            loginFailed();
        }else{
            req.session.uID = data[0]._id;
            req.session.admin = data[0].admin;
            res.redirect("/home");
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect("/login");
    });
});

/* Log out of the account */
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err != null) console.log(err);
    });
    res.clearCookie("SESS_ID");
    res.redirect("/");
});

/* Requests all accounts */ 
router.get("/accounts", (req, res) => {
    console.log("Getting all accounts");
    Account.find()
    .then( data => {
        res.send(data);
    })
    .catch( err => {
        res.status(500).send({err : err});
    });
});

/* Check if an account if a given username exists */
router.get("/accountexists/:uname", (req,res) => {
    console.log("Checking if account already exists with username: " + req.params.uname);
    Account.find({ username : req.params.uname })
    .then( data => {
        var exists = data.length == 0 ? false : true;
        res.send({ exists : exists });
    })
    .catch( err => {
        console.log(err)
        res.status(500).send({ err : err });
    });
});

/* Delete an account with a given ID */
router.post("/deleteuser/:id", (req,res) => {
    console.log("Deleteing an account with id: " + req.params.id);
    Account.findByIdAndDelete(req.params.id)
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

/* Delete an account with a given ID */
router.post("/changeaccount/:type/:value/:id", (req,res) => {
    console.log("Editing an account with id: " + req.params.id + " Changing: " + req.params.type + " to " + req.params.value);
    var options = {}
    switch(req.params.type) {
        case 'name':
            console.log("Change name");
            options = { 'fname' : req.params.value}
            break;
        case 'lname':
            console.log("Change Last name");
            options = { 'lname' : req.params.value}
            break;
        case 'pass':
            console.log("Change password");
            options = { 'password' : req.params.value}
            break;
        case 'admin':
            console.log("Change account type");
            options = { 'admin' : req.params.value}
            break;
    }
    console.log(options)
    Account.findByIdAndUpdate(req.params.id, options)
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

module.exports = router;