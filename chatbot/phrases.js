var phrases = {
  "inspirational": [
    "You'll ace that test!"
  ]
}

exports.get = function(phraseKey) {
  return phrases[phraseKey][Math.floor(Math.random() * phrases[phraseKey].length)];
}
