/*
This is the interface Learn It! uses to communicate between the Botkit conversation system and API.AI's SDK.
Whenever chatbot.js needs to do some AI processing on an incoming message, it will

Learn It! uses some advanced features of API.AI, like incomplete actions and contexts, so we have chosen not to use the botkit-middleware-apiai package and instead use the apiai package directly, which exposes the API.AI functionality this bot requires.
*/

var apiai = require("apiai");
var uuidV1 = require("uuid/v1");

apiai = apiai(process.env.APIAI_ACCESS_TOKEN);

module.exports = function(message, conversation, callback) {
  if (!("sessionId" in conversation.vars)) {
    conversation.vars.sessionId = uuidV1();
  }
  // Remove @mentions to Learn It!
  function loop(message, conversation) {
    var text = message.text.replace(/\bLearn\b/g, "").trim();
    var request = apiai.textRequest(text, {
      sessionId: conversation.vars.sessionId
    });
    request.on("response", function(response) {
      if (response.result.actionIncomplete) {
        conversation.ask(response.result.fulfillment.speech, function(message, conversation) {
          loop(message, conversation);
          conversation.next();
        });
      } else {
        callback(response.result);
      }
    });
    request.end();
  }
  loop(message, conversation);
}
