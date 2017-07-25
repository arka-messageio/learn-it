var setStorage = require("./storage/set.js");
var classStorage = require("./storage/class.js");
var joinedClassesStorage = require("./storage/joined-classes.js");

module.exports = function(app, options) {
  app.get("/", function (request, response) {
    response.render("index.ejs", {
      user: request.user
    });
  });

  app.get("/sets", function(request, response) {
    if (!request.isAuthenticated()) {
      response.redirect("/login");
      return;
    }
    response.render("sets.ejs", {
      user: request.user,
      sets: setStorage.readAll(request.user),
      joinedClasses: joinedClassesStorage.read(request.user),
      assignedSets: joinedClassesStorage.readAllAssignedSets(request.user)
    });
  });
  
  app.get("/teachers-lounge", function(request, response) {
    if (!request.isAuthenticated()) {
      response.redirect("/login");
      return;
    }
    var classes = classStorage.readAll(request.user);
    classes.forEach(function(clazz) {
      clazz.studentsAssignedSets = classStorage.readAllStudentsAssignedSets(clazz.owner, clazz.label);
    });
    response.render("teachers-lounge.ejs", {
      user: request.user,
      classes: classes,
      sets: setStorage.readAll(request.user)
    });
  });
  
  app.get("/help", function(request, response) {
    response.render("help.ejs", {
      user: request.user
    });
  });
}