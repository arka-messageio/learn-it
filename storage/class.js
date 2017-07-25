var fsExtra = require("fs-extra");
var crypto = require("crypto");

var fsUtil = require("./fs-util");
var setStorage = require("./set");

exports.allClassesLocation = function(personId) {
  return ".data/" + personId + "/classes";
}

exports.classLocation = function(personId, label) {
  return exports.allClassesLocation(personId) + "/" + label.replace("/", "-") + ".json";
}

exports.globalClassLocation = ".data/global-classes.json";

exports.create = function(owner, label) {
  var classCode = crypto.randomBytes(4).toString("hex");
  var clazz = {
    label: label,
    owner: owner,
    students: [],
    assignedSetsLabels: [],
    classCode: classCode
  }
  exports.write(owner, clazz);
  var globalClasses = exports.readGlobalClasses();
  globalClasses[classCode] = clazz;
  exports.writeGlobalClasses(globalClasses);
  return clazz;
}

exports.read = function(owner, label) {
  var location = exports.classLocation(owner.personId, label);
  var file = JSON.parse(fsUtil.readFile(location));
  file.label = label;
  return file;
}

exports.readAll = function(owner) {
  var location = exports.allClassesLocation(owner.personId);
  return fsUtil.readdir(location).map(function(label) {
    return exports.read(owner, label.replace(/\.json$/, ""));
  });
}

exports.write = function(owner, clazz) {
  var location = exports.classLocation(owner.personId, clazz.label);
  fsUtil.writeFile(location, JSON.stringify({
    owner: clazz.owner,
    students: clazz.students,
    assignedSetsLabels: clazz.assignedSetsLabels,
    classCode: clazz.classCode
  }));
}

exports.assignSet = function(owner, label, setLabel) {
  var clazz = exports.read(owner, label);
  clazz.students.forEach(function(student) {
    fsExtra.copySync(setStorage.setLocation(owner.personId, setLabel), setStorage.setLocation(student.personId, setLabel, true));
  });
  clazz.assignedSetsLabels.push(setLabel);
  exports.write(owner, clazz);
}

exports.readAllStudentsAssignedSets = function(owner, label) {
  var clazz = exports.read(owner, label);
  var studentsAssignedSets = {};
  clazz.assignedSetsLabels.forEach(function(assignedSetLabel) {
    clazz.students.forEach(function(student) {
      if (studentsAssignedSets[assignedSetLabel] === undefined) {
        studentsAssignedSets[assignedSetLabel] = [];
      }
      studentsAssignedSets[assignedSetLabel].push({
        student: student,
        set: setStorage.read(student, assignedSetLabel, true)
      });
    });
  });
  return studentsAssignedSets;
}

exports.readGlobalClasses = function() {
  return JSON.parse(fsUtil.readFile(exports.globalClassLocation));
}

exports.writeGlobalClasses = function(globalClasses) {
  fsUtil.writeFile(exports.globalClassLocation, JSON.stringify(globalClasses));
}
