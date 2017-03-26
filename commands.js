"use strict";

const columnify = require("columnify");

var commands = new Map();
var defaultCommandString = null;

process.stdin.setEncoding("utf8");

function register(name, description, script) {
  commands.set(name, {
    "description": description,
    "script": script
  })
};

function run(commandString, chained) {
  var that = this;
  var command = commands.get(commandString);
  if (command) {
    var promise = new Promise(command.script);
    if (!chained) {
      promise.then(function() {
        that.finish();
      });
    }
    return promise;
  } else if (defaultCommandString) {
    return this.run(defaultCommandString);
  }
}

function print() {
  var data = {};
  commands.forEach(function(command, commandString) {
    data[commandString] = command.description;
  });
  this.tellWithTable(data);
}

function setDefault(commandString) {
  defaultCommandString = commandString;
}

function tell(string) {
  process.stdout.write(string);
}

function tellWithTable(data) {
  this.tell(columnify(data, {
    showHeaders: false
  }) + "\n");
}

function ask(question) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.tell(question + "\n");
    that.tell("> ");
    process.stdin.on("data", function(text) {
      resolve(text.replace("\n", ""));
    });
  });
}

function finish() {
  process.exit();
}

module.exports = {
  "register": register,
  "run": run,
  "print": print,
  "setDefault": setDefault,
  "tell": tell,
  "tellWithTable": tellWithTable,
  "ask": ask,
  "finish": finish
}
