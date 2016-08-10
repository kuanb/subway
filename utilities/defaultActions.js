

module.exports = function (app) {

  app.use(function (req, res, next){  
    // Use this in the future to run actions on every server call
    // Create more of these within routes if there are default route specific actions that need to occur every time
    next();
  });

}