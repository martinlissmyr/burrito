"use strict";

const columnify = require("columnify");

var commands = new Map();
var defaultCommandString = null;

process.stdin.setEncoding("utf8");

module.exports = {
  "register": function(name, description, script) {
    commands.set(name, {
      "description": description,
      "script": script
    })
  },
  "run": function(commandString, chained) {
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
  },
  "print": function() {
    var data = {};
    commands.forEach(function(command, commandString) {
      data[commandString] = command.description;
    });
    this.tellTable(data);
  },
  "setDefault": function(commandString) {
    defaultCommandString = commandString;
  },
  "tell": function(string) {
    process.stdout.write(string);
  },
  "tellTable": function(data) {
    this.tell(columnify(data, {
      showHeaders: false
    }) + "\n");
  },
  "ask": function(question) {
    var that = this;
    return new Promise(function(resolve, reject) {
      that.tell(question + "\n");
      that.tell("> ");
      process.stdin.on("data", function(text) {
        resolve(text.replace("\n", ""));
      });
    });
  },
  "finish": function() {
    process.exit();
  }
}
