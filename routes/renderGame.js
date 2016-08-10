

// START ROUTER
var express = require("express");
var router = express.Router();


// BASIC RESPONSE
router.get("/", function (req, res) {
  res.send("game view.")
});


// EXPORT ROUTER OBJECt
module.exports = router;

