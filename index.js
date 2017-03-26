"use strict";

const commands = require("./commands");
const publish = require("./publish");
const config = require("./config");
const util = require("./util");

commands.register("publish", "Publish a package to S3", function(resolve, reject) {
  if (config.get("WRAP_S3_ACCESS_KEY")) {
    var publishing = publish();
    publishing.then(function(url) {
      commands.tell("Your module is now available at: " + url + "\n");
      resolve();
    });

    publishing.catch(function(error) {
      commands.tell(error + "\n");
      resolve();
    });
  } else {
    commands.run("config:set", true).then(function() {
      commands.run("publish");
    });
  }
});

commands.register("help", "Get help", function(resolve, reject) {
  commands.tell("\nUsage: wrap <command>\n\n");
  commands.tell("Where <command> is one of:\n");
  commands.print();
  resolve();
});

commands.register("config", "Show S3 Configuration", function(resolve, reject) {
  commands.tellWithTable(util.toObject(config.getAllWithDescriptionsAndValues()));
  resolve();
});


commands.register("config:set", "Configure S3", function(resolve, reject) {
  function askIteratively(i) {
    var c = i.next();
    if (!c.done) {
      commands.ask(c.value[1]).then(function(answer) {
        config.set(c.value[0], answer);
        askIteratively(i);
      });
    } else {
      resolve();
    }
  }
  askIteratively(config.getAllWithDescriptions().entries());
});

commands.setDefault("help");

commands.run(process.argv[2]);


