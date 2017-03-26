"use strict";

const fStream = require("fstream-npm");
const tarPack = require("tar-pack").pack;
const writeStream = require("fs").createWriteStream;
const readStream = require("fs").createReadStream;
const read = require("fs").readFileSync;
const exists = require("fs").existsSync;
const deleteFile = require("fs").unlinkSync;
const AWS = require("aws-sdk");
const path = require("path");
const config = require("./config");
const fs = require("fs");
const string = require("string");

function slugify(str) {
  return string(str).slugify().s;
}

function pack() {
  return new Promise(function(resolve, reject) {
    var folder = process.cwd();
    var pkg, p, filePath;

    if (exists(folder + "/package.json")) {
      pkg = JSON.parse(read(folder + "/package.json"));
      filePath = folder + "/" + slugify(pkg.name) + "-" + pkg.version.replace("+", "-") + ".tgz";
      p = tarPack(fStream(folder));

      p.pipe(writeStream(filePath));
      p.on("error", function(error) {
        reject(error.stack);
      });
      p.on("close", function() {
        resolve(filePath);
      });
    } else {
      reject("Not a package");
    }
  });
}

function upload(filePath) {
  AWS.config = {
    accessKeyId: config.get("WRAP_S3_ACCESS_KEY"),
    secretAccessKey: config.get("WRAP_S3_SECRET_ACCESS_KEY"),
    signatureVersion: "v4"
  };
  return new Promise(function(resolve, reject) {
    var s3 = new AWS.S3();
    var fileName = path.parse(filePath).base;
    var fileStream = readStream(filePath);

    s3.upload({
      Bucket: config.get("WRAP_S3_BUCKET"),
      Key: fileName,
      Body: fileStream,
      ACL: "public-read"
    }, function(error, data) {
      if (error) {
        reject(error);
      } else {
        deleteFile(filePath);
        resolve(data.Location);
      }
    });
  });
}

module.exports = function() {
  return new Promise(function(resolve, reject) {
    var packing = pack();

    packing.then(function(filePath) {
      var uploading = upload(filePath);

      uploading.then(function(url) {
        resolve(url);
      });

      uploading.catch(function(error) {
        reject(error);
      });
    });

    packing.catch(function(error) {
      reject(error);
    });
  });
}
