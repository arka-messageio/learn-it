var bodyParser = require("body-parser");
var url = require("url");

var chatbot = require("./chatbot/chatbot");
var studyblue = require("./platforms/studyblue");
var setStorage = require("./storage/set");
var classStorage = require("./storage/class");
var joinedClassesStorage = require("./storage/joined-classes");

module.exports = function(app) {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  
  // TODO Add Quizlet
  app.get("/api/external-search/studyblue", function(request, response) {
    studyblue.search(request.query.term, function(results) {
      response.json(results);
    });
  });
  
  app.post("/api/sets/:label", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    // TODO Add Quizlet
    var hostname = url.parse(request.body.url).hostname;
    if (hostname === "www.studyblue.com") {
      studyblue.cards(request.body.url, function(vocab) {
        setStorage.create(request.user, request.params.label, vocab);
        response.status(200).end();
      });
    } else {
      // Not implemented.
      response.status(501).end();
    }
  });
  
  app.delete("/api/sets/:label", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    // TODO
  });
  
  app.post("/api/sets/:label/study", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    chatbot.study(request.user, request.params.label);
    response.status(200).end();
  });
  
  app.post("/api/join-class/:code", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    if (joinedClassesStorage.joinClass(request.user, request.params.code) === false) {
      response.status(404).end();
      return;
    }
    response.status(200).end();
  });
  
  app.delete("/api/join-class/:label", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    // TODO
  });
  
  app.post("/api/classes/:label", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    classStorage.create(request.user, request.params.label);
    response.status(200).end();
  });
  
  app.delete("/api/classes/:label", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    // TODO
  });
  
  app.post("/api/classes/:label/assign", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    classStorage.assignSet(request.user, request.params.label, request.body.setLabel);
    response.status(200).end();
  });
  
  app.delete("/api/classes/:label/assign", function(request, response) {
    if (!request.isAuthenticated()) {
      // Unauthorized.
      response.status(401).end();
      return;
    }
    // TODO
  });
}
