const port = 25565;
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

/* ROUTES */
const deviceRoutes = require("./routes/DeviceRoutes");
const accountRoutes = require("./routes/Accounts");
const dataRoutes = require("./routes/DataRoutes");
const timerRoutes = require("./routes/Timer");
const statsRoutes = require("./routes/StatsRoutes");

const cronJob = require("./cronjob.js");
/*************************************************************/

/* MODELS */
/*************************************************************/

/* EXPRESS MIDDLEWARE */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded( { extended : true } ));
app.use(bodyParser.json());
app.use(require('sanitize').middleware);

mongoose.connect(
    "mongodb+srv://dbadmin:dbpassword@cluster0-nxxww.mongodb.net/EnsonaBiry",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);

const sessionStore = new MongoStore({
    mongooseConnection : mongoose.connection,
    collection : "EBsessions"
})

app.use(session({
    name : "SESS_ID",
    secret : "secret",
    resave : false,
    saveUninitialized : false,
    store : sessionStore,
    cookie : {
        maxAge : 2592000000,
        sameSite : true,
        secure : false,
        httpOnly : true
    }
}));
/*************************************************************/


const redirectLogin = (req, res, next) => {
    if(!req.session.uID) {
        res.redirect("/login");
    }else{
        next();
    }
};

const redirectHome = (req, res, next) => {
    if(req.session.uID) {
        res.redirect("/");
    }else{
        next();
    }
};

app.use("/", deviceRoutes);
app.use("/", accountRoutes);
app.use("/", dataRoutes);
app.use("/", timerRoutes);
app.use("/", statsRoutes);

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/devicestest", (req, res) => {
    res.sendFile(path.join(__dirname + '/views/run.html'));
});

app.listen(port, () => {
    console.log("Server listening on port ", port)
});



/*************************************************************/
/* Email notification if server closes on accident */


var transporter = require('nodemailer').createTransport({
  service: 'gmail',
  auth: {
    user: 'roost.team@gmail.com',
    pass: 'TheCoolest123'
  }
});


process.on('SIGHUP', function() {
    console.log('Sending notification and closing');

    transporter.sendMail({
        from: 'roost.team@gmail.com',
        to: 'roost.team@gmail.com',
        subject: 'Server',
        text: 'The server has closed...'
      }, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            process.exit();
        }
    });
    
});


// //Randomised power usage
// for (var j = 0; j < time.getHours() - appliances[i].time; j++) {
//     appliances[i].usage += Math.floor(Math.random() * (appliances[i].wattage + variation)) + (appliances[i].wattage - appliances[i].variation);
// }


