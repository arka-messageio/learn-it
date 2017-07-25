/**
 * This is the entry point of the application.
 * It requires all other modules and ties together everything.
 */

var express = require("express");
var bodyParser = require("body-parser");

var auth = require("./auth");
var api = require("./api");
var chatbot = require("./chatbot/chatbot");
var webview = require("./webview");

var app = chatbot.webserver;

app.use(express.static("public"));

auth(app);

api(app);

webview(app);
