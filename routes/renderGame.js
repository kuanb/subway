

// START ROUTER
var express = require("express");
var router = express.Router();


// BASIC RESPONSE
router.get("/", function (req, res) {
  res.render("game/main")
});


// EXPORT ROUTER OBJECt
module.exports = router;

