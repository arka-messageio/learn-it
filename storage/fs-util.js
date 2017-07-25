var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");

exports.readdir = function(path) {
  mkdirp.sync(path);
  return fs.readdirSync(path);
}

exports.writeFile = function(file, data) {
  mkdirp.sync(path.dirname(file));
  fs.writeFileSync(file, data);
}

exports.readFile = function(file) {
  mkdirp.sync(path.dirname(file));
  try {
    fs.closeSync(fs.openSync(file, "wx"));
    fs.writeFileSync(file, "{}");
  } catch (e) {
    // Path exists. Ignore exception.
  }
  return fs.readFileSync(file);
}
