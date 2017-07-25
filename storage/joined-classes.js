var fsUtil = require("./fs-util");
var setStorage = require("./set");
var classStorage = require("./class");

exports.joinedClassesLocation = function(personId) {
  return ".data/" + personId + "/joined-classes.json";
}

exports.create = function(owner) {
  var joinedClasses = [];
  exports.write(owner, joinedClasses);
  return joinedClasses;
}

exports.read = function(owner) {
  var location = exports.joinedClassesLocation(owner.personId);
  var object = JSON.parse(fsUtil.readFile(location));
  if (Array.isArray(object)) {
    return object;
  } else {
    return [];
  }
}

exports.readAllAssignedSets = function(owner) {
  var joinedClasses = exports.read(owner);
  var assignedSets = {};
  joinedClasses.forEach(function(clazz) {
    classStorage.read(clazz.owner, clazz.label).assignedSetsLabels.forEach(function(assignedSetLabel) {
      if (assignedSets[clazz.label] === undefined) {
        assignedSets[clazz.label] = [];
      }
      assignedSets[clazz.label].push(setStorage.read(owner, assignedSetLabel, true));
    });
  });
  return assignedSets;
}

exports.write = function(owner, joinedClasses) {
  var location = exports.joinedClassesLocation(owner.personId);
  return fsUtil.writeFile(location, JSON.stringify(joinedClasses));
}

exports.joinClass = function(owner, classCode) {
  var globalClasses = classStorage.readGlobalClasses();
  if (!(classCode in globalClasses)) {
    return false;
  }
  var staleClass = globalClasses[classCode];
  var clazz = classStorage.read(staleClass.owner, staleClass.label);
  clazz.students.push(owner);
  var joinedClasses = exports.read(owner);
  joinedClasses.push(clazz);
  exports.write(owner, joinedClasses);
  classStorage.write(clazz.owner, clazz);
}