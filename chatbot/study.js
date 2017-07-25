// Require external libraries.
var assert = require("assert");
var botkit = require("botkit");
var recitusCore = require("recitus-core");

// Require internal libraries.
var phrases = require("./phrases");
var setStorage = require("../storage/set");

module.exports = function(conversation, set) {
  console.log(JSON.stringify(set));
  var newProgress = {
    date: new Date(),
    qualities: [0, 0, 0, 0, 0, 0],
    untested: set.progress[set.progress.length - 1].untested,
    total: set.progress[0].total
  };
  var recitus = new recitusCore.default(set.vocabPath, set.bankPath);
  // TODO Add new words per sesson
  recitus.start(newProgress.total);
  conversation.onTimeout(function(converstaion) {
    stop(conversation);
    conversation.say("Unfortunately, this study session has expired.");
    conversation.next();
  });
  function ask(flashcard, conversation, callback) {
    var hesitant = false;
    var hesitancyTimer = setTimeout(function() {
      hesitant = true;
    }, (flashcard.a.length * parseInt(process.env.EXPECTED_MILLISECONDS_PER_LETTER)) + parseInt(process.env.EXPECTED_MILLISECONDS_ADDITIONAL));
    conversation.ask(flashcard.q, [
      {
        pattern: /^\/idk$/i,
        callback: function(message, conversation) {
          conversation.say("That's OK.");
          conversation.say("The correct answer was:\n\n>" + flashcard.a);
          callback(0);
          conversation.next();
        }
      },
      {
        pattern: /^\/quit$/i,
        callback: function(message, conversation) {
          conversation.say("Alright, see you next time!");
          stop(conversation);
          conversation.next();
        }
      },
      {
        default: true,
        callback: function(message, conversation) {
          clearTimeout(hesitancyTimer);
          var correct = message.text.toLowerCase() === flashcard.a.toLowerCase();
          if (correct) {
            conversation.say("Correct 💯!");
            if (hesitant) {
              conversation.say("However, you seemed a bit hesitant to answer that one.");
              conversation.ask("Was it difficult for you to remember the answer (respond truthfully 🙂)?", [
                {
                  pattern: /^(yes|yea|yup|yep|ya|sure|ok|y|yeah|yah)/i,
                  callback: function(message, conversation) {
                    conversation.say("That's fine. The great thing is that you were able to remember the right answer!");
                    callback(3);
                    conversation.next();
                  }
                },
                {
                  pattern: /^(no|nah|nope|n)/i,
                  callback: function(message, conversation) {
                    conversation.say("Great!");
                    callback(4);
                    conversation.next();
                  }
                },
                {
                  default: true,
                  callback: function(message, conversation) {
                    conversation.say("I'm sorry, I couldn't understand your answer.");
                    conversation.say("Please answer *`yes`* or *`no`*.");
                    conversation.repeat();
                    conversation.next();
                  }
                }
              ]);
            } else {
              callback(5);
            }
          } else {
            conversation.say("Sorry, that wasn't the right answer 😕.");
            callback();
          }
          conversation.next();
        }
      }
    ]);
  }
  function loop(first) {
    if (recitus.empty()) {
      stop(conversation);
      conversation.say("Great work!");
      conversation.say("Those are all the words you need to study for now.");
      conversation.say(phrases.get("inspirational"));
      return;
    }
    if (first) {
      conversation.say("Let's start...");
      conversation.say("*(If you ever get completely stuck, just type `/idk` to move to the next question).*");
    } else {
      conversation.say("Next question...");
    }
    function done(quality) {
      newProgress.qualities[quality]++;
      loop();
    }
    function repeat(flashcard) {
      conversation.say("Let's try that one again...");
      ask(flashcard, conversation, function(quality) {
        if (quality === undefined) {
          repeat(flashcard);
        } else {
          if (quality === 5) {
            done(2);
          } else if (quality === 4) {
            done(1);
          } else {
            done(quality);
          }
        }
      });
    }
    var flashcard = recitus.pick();
    ask(flashcard, conversation, function(quality) {
      if (quality === undefined) {
        repeat(flashcard);
      } else {
        done(quality);
      }
    });
  }
  loop(true);
  function stop(conversation) {
    newProgress.untested -= 0;
    set.progress.push(newProgress);
    setStorage.write({
      personId: conversation.vars.personId
    }, set);
    recitus.stop();
  }
}
