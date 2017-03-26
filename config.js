"use strict";

const write = require("fs").writeFileSync;
const read = require("fs").readFileSync;
const exists = require("fs").existsSync;

var config = {};
var fileName = __dirname + "/" + ".config";

function loadConfig() {
  if (exists(fileName)) {
    config = JSON.parse(read(fileName));
  }
}

function saveConfig() {
  write(fileName, JSON.stringify(config));
}

function setConfig(key, value) {
  config[key] = value;
  //saveConfig();
}

function getConfig(key) {
  return config[key];
}

loadConfig();

module.exports = {
  "get": getConfig,
  "set": setConfig
}
