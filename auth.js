var bodyParser = require("body-parser");
var ciscospark = require("ciscospark");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var passport = require("passport");
var passportOauth = require("passport-oauth");

passport.use("ciscospark", new passportOauth.OAuth2Strategy({
    authorizationURL: "https://api.ciscospark.com/v1/authorize",
    tokenURL: "https://api.ciscospark.com/v1/access_token",
    clientID: process.env.CISCOSPARK_OAUTH_CLIENT_ID,
    clientSecret: process.env.CISCOSPARK_OAUTH_CLIENT_SECRET,
    callbackURL: "https://" + process.env.PROJECT_DOMAIN + ".glitch.me/oauth"
  },
  function(accessToken, refreshToken, profile, done) {
    ciscospark.init({
      credentials: {
        authorization: {
          access_token: accessToken
        }
      }
    }).people.get("me").then(function(person) {
      return {
        personId: person.id,
        personEmail: person.emails[0],
        displayName: person.displayName
      };
    }).then(function(user) {
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = function(app) {
  var module = {};
  
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.get("/login", passport.authenticate("ciscospark", {
    scope: "spark:people_read"
  }));
  
  app.get("/oauth", passport.authenticate("ciscospark", {
    scope: "spark:people_read",
    successRedirect: "/",
    failureRedirect: "/"
  }));
  
  app.get("/logout", function(request, response) {
    request.logout();
    response.redirect("/");
  });
  
  return module;
}
