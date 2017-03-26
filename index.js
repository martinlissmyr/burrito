"use strict";

const commands = require("./commands");
const publish = require("./publish");
const config = require("./config");

commands.register("publish", "Publish a package to S3", function(resolve, reject) {
  if (config.get("NOPM_S3_ACCESS_KEY")) {
    publish().then(function(filename) {
      commands.tell(filename + "\n");
      resolve();
    });
  } else {
    commands.run("config:set", true).then(function() {
      commands.run("publish");
    });
  }
});

commands.register("help", "Get help", function(resolve, reject) {
  commands.tell("\nUsage: nopm <command>\n\n");
  commands.tell("Where <command> is one of:\n");
  commands.print();
  resolve();
});

commands.register("config", "Show S3 Configuration", function(resolve, reject) {
  commands.tellTable({
    "S3 Access Key:": config.get("NOPM_S3_ACCESS_KEY"),
    "S3 Secret Access Key:": config.get("NOPM_S3_SECRET_ACCESS_KEY"),
    "S3 Bucket: ": config.get("NOPM_S3_BUCKET")
  });
  resolve();
});

commands.register("config:set", "Configure S3", function(resolve, reject) {
  commands.ask("S3 Access Key").then(function(answer) {
    config.set("NOPM_S3_ACCESS_KEY", answer);
    commands.ask("S3 Secret Access Key").then(function(answer) {
      config.set("NOPM_S3_SECRET_ACCESS_KEY", answer);
      commands.ask("S3 Bucket").then(function(answer) {
        config.set("NOPM_S3_BUCKET", answer);
        resolve();
      });
    });
  });
});

commands.setDefault("help");

commands.run(process.argv[2]);


