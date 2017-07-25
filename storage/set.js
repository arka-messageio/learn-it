var fsUtil = require("./fs-util");

exports.allSetsLocation = function(personId, assigned) {
  var location = ".data/" + personId;
  if (assigned) {
    location += "/assigned-sets";
  } else {
    location += "/sets";
  }
  return location;
}

exports.setLocation = function(personId, label, assigned) {
  return exports.allSetsLocation(personId, assigned) + "/" + label.replace("/", "-");
}

exports.create = function(owner, label, vocab, assigned) {
  var location = exports.setLocation(owner.personId, label, assigned);
  var set = {
    label: label,
    vocabPath: location + "/vocab.json",
    bankPath: location + "/bank.json",
    progress: [
      {
        date: new Date(),
        qualities: [0, 0, 0, 0, 0, 0],
        untested: vocab.length,
        total: vocab.length
      }
    ]
  }
  fsUtil.writeFile(set.vocabPath, JSON.stringify(vocab));
  exports.write(owner, set, assigned);
  return set;
}

exports.read = function(owner, label, assigned) {
  var location = exports.setLocation(owner.personId, label, assigned);
  var progress = JSON.parse(fsUtil.readFile(location + "/progress.json"));
  if (!(Array.isArray(progress))) {
    progress = [];
  }
  return {
    label: label,
    vocabPath: location + "/vocab.json",
    bankPath: location + "/bank.json",
    progress: progress,
    assigned: assigned
  };
}

exports.readAll = function(owner, assigned) {
  var location = exports.allSetsLocation(owner.personId, assigned);
  return fsUtil.readdir(location).map(function(label) {
    return exports.read(owner, label);
  });
}

exports.write = function(owner, set) {
  var location = exports.setLocation(owner.personId, set.label, set.assigned);
  fsUtil.writeFile(location + "/progress.json", JSON.stringify(set.progress));
}

exports.find = function(owner, label) {
  label = label.replace("/", "-");
  var candidates = [];
  var all = exports.readAll(owner).concat(exports.readAll(owner, true));
  for (var i = 0; i < all.length; i++) {
    if (all[i].label.toLowerCase().startsWith(label.toLowerCase())) {
      candidates.push(all[i]);
    }
  }
  if (candidates.length === 1) {
    return candidates[0];
  } else if (candidates.length === 0) {
    return undefined;
  } else {
    return candidates;
  }
}
