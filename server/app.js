

// SECRETS
var credentials = require("../credentials");
var SESS_SECRET = credentials.sessionSecret;


// APP INITIATE
var express = require("express");
var app = express();


// APP DEPENDENCIES
var bodyParser = require("body-parser");


// CONFIGURATION STEPS PT1
app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use("/modules", express.static("node_modules"));


// CONFIGURATION STEPS PT2
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// ALL ROUTES
// Always run before routes
require("../utilities/defaultActions")(app);

// Route Set 1
var routeExample = require("../routes/example");
app.use("/test", routeExample)

// Route Set 2
var renderGame = require("../routes/renderGame");
app.use("/game", renderGame)


// START UP CLIENTCOMM
var port = 4040;
var server = app.listen(port, function () { 
  console.log("Subway app up and running on port", port);
});


// EXPORT SERVER
module.exports = server;


