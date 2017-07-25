// Require necessary external modules.
var botkit = require("botkit");
var url = require("url");

// Require necessary internal modules.
var apiai = require("./apiai");
var study = require("./study");
var studyblue = require("../platforms/studyblue");
var setStorage = require("../storage/set");

var controller = botkit.sparkbot({
  log: true,
  public_address: "https://" + process.env.PROJECT_DOMAIN + ".glitch.me",
  ciscospark_access_token: process.env.CISCOSPARK_ACCESS_TOKEN,
  secret: process.env.CISCOSPARK_SECRET
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.PORT, function(error, webserver) {
  controller.createWebhookEndpoints(webserver, bot);
});
// Export the webserver so it can be used for the web view using Express later.
// (Botkit uses Express internally).
exports.webserver = controller.webserver;

function talk(message, conversation) {
  if (message.text === "/reset") {
    for (var i = 0; i < 50; i++) {
      conversation.say("\n\n");
    }
    return;
  }
  apiai(message, conversation, function(result) {
    if (result.action === "help") {
      conversation.say("I can help you file, view, and stay up-to-date with bug reports very easily.");
      conversation.say("Here's a full list of everything that I can help you with:");
      // Don't do this in multiple conversation.say events because conversation.say intentionally delays messages by at least 1 second between each message (so it feels like the bot is talking).
      // However, the 1 second delay would take too long to print this many lines.
      conversation.say(" - Reporting a new bug\n\n" +
                       " - Viewing information about an existing bug\n\n" +
                       " - Subscribing to changes to an existing bug\n\n" +
                       " - Unsubscribing to changes to an existing bug\n\n" +
                       " - Commenting on an existing bug");
      conversation.say("You can access these functions directly by typing `/report`, `/view`, `/subscribe`, `/unsubscribe` and `/comment`.");
      conversation.say("However, **don't**.");
      conversation.say("I'm quite intelligent, so feel free to talk to be just as you would with any human. Chances are that I'll understand what you're saying and do the right thing.");
      conversation.say("For example, you can say \"I want to report a very important bug about my computer,\" and I'll know exactly what to do.");
      conversation.say("I can even feel emotions! ❤️");
      conversation.say("So go ahead, try me!");
      conversation.say("*(Note: If at any time, you want to quit talking with me, just type `/quit`).*");
    } if ((result.action === "fallback") || result.action.startsWith("smalltalk")) {
      conversation.say(result.fulfillment.speech);
    } else if (result.action.startsWith("set")) {
      if (result.action === "set.create") {
        var hostname = new url.URL(result.paramters.url).hostname;
        if (hostname === "studyblue.com") {
        } else {
          conversation.say("I'm sorry, I can only understand links to StudyBlue right now.");
        }
      } else if (result.action === "set.list") {
        
      } else if (result.action === "set.study") {
        studyOnConversation(conversation, result.parameters.set);
      } else if (result.action === "help") {
        
      }
    } else if (result.action.startsWith("class")) {
      if (result.action === "class.create") {
        
      } else if (result.action === "class.list") {
        
      }
    }
  });
}

// This happens in a group room, so don't add this conversation to personIdToPrivateConversationMap (this is not a private conversation).
controller.on("direct_mention", function(bot, message) {
  bot.startConversation(message, function(error, conversation) {
    conversation.vars.personId = message.original_message.personId;
    talk(message, conversation);
  });
});

// This maps a Cisco Spark's personId to any conversation that they currently have ongoing with the bot.
// It is used so that a previous conversation can be interrupted and stopped when a new push notification comes in.
var personIdToPrivateConversationMap = {};
// This happens only in a private conversation, so add the conversation that was created to personIdToPrivateConversationMap.
controller.on("direct_message", function(bot, message) {
  bot.startConversation(message, function(error, conversation) {
    personIdToPrivateConversationMap[message.original_message.personId] = conversation;
    conversation.vars.personId = message.original_message.personId;
    talk(message, conversation);
  });
});

function studyOnConversation(conversation, label) {
  var found = setStorage.find({
    personId: conversation.vars.personId
  }, label);
  if (found === undefined) {
    conversation.say("I couldn't find a flashcard set named \"" + label + "\".")
  } else if (Array.isArray(found)) {
    conversation.say("There are multiple flashcard sets that start with \"" + label + "\":");
  } else {
    study(conversation, found);
  }
}

exports.study = function(owner, label) {
  if (owner.personId in personIdToPrivateConversationMap) {
    personIdToPrivateConversationMap[owner.personId].stop();
  }
  bot.startPrivateConversation({
    user: owner.personEmail
  }, function(error, conversation) {
    personIdToPrivateConversationMap[owner.personId] = conversation;
    conversation.vars.personId = owner.personId;
    conversation.say("You told me you want to study \"" + label + "\".");
    studyOnConversation(conversation, label);
  });
}