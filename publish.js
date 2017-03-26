"use strict";

const stream = require("fstream-npm");
const tarPack = require("tar-pack").pack;
const write = require("fs").createWriteStream;

function pack() {
  return new Promise(function(fulfill, reject) {
    var folder = process.cwd();
    var pkg = require(folder + "/package.json");
    var filename = process.cwd() + "/" + pkg.name + "-" + pkg.version + ".tgz";
    var p = tarPack(stream(folder));

    p.pipe(write(filename));
    p.on("error", function (err) {
      reject(err.stack);
    });
    p.on("close", function () {
      fulfill(filename);
    });
  });
}

module.exports = function() {
  return new Promise(function(fulfill, reject) {
    pack().then(function(filename) {
      fulfill(filename);
    });
  });
}
