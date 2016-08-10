

// SECRET STUFF
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
app.use(cookieParser());


// CONFIGURATION STEPS PT2
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(flash());
app.use(session({
  keys: [SESS_SECRET],
  name: "subwayGameAppSessionName",
}));


// ALL ROUTES
// Always run before routes
require("../routes/request-defaults")(app);

// Route Set 1
var routeExample = require("../routes/example");
app.use("/test", routeExample)


// START UP CLIENTCOMM
var port = 4040;
var server = app.listen(port, function () { 
  console.log("Subway app up and running on port", port);
});



// EXPORT SERVER
module.exports = server;


