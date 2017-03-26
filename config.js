"use strict";

const write = require("fs").writeFileSync;
const read = require("fs").readFileSync;
const exists = require("fs").existsSync;

var c = {};
var fileName = process.cwd() + "/" + ".burrito-config";
var configurations = new Map();

configurations.set("WRAP_S3_ACCESS_KEY", "S3 Access Key");
configurations.set("WRAP_S3_SECRET_ACCESS_KEY", "S3 Secret Access Key");
configurations.set("WRAP_S3_BUCKET", "S3 Bucket");

if (exists(fileName)) {
  c = JSON.parse(read(fileName));
}

function saveConfig() {
  write(fileName, JSON.stringify(c));
}

function setConfig(key, value) {
  c[key] = value;
  saveConfig();
}

function getConfig(key) {
  return c[key];
}

function getAllWithDescriptionsAndValues() {
  var list = new Map();
  configurations.forEach(function(description, key) {
    list.set(description + ":", getConfig(key));
  });
  return list;
}

function getAllWithDescriptions() {
  return configurations;
}

module.exports = {
  "get": getConfig,
  "set": setConfig,
  "getAllWithDescriptionsAndValues": getAllWithDescriptionsAndValues,
  "getAllWithDescriptions": getAllWithDescriptions
}
