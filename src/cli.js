#!/usr/bin/env node

const yargs = require("yargs");
const yoloUp = require("./yoloUp");

function builder(command) {
  return command
    .positional("projectRoot", {
      describe: "Path of project root",
      default: ".",
      type: "string",
    })
    .option("packageManager", {
      describe: "Package manager",
      default: "infer",
      choices: ["npm", "yarn", "pnpm", "infer"],
      type: "string",
    });
}

yargs.command("* [projectRoot]", false, builder, yoloUp).parse();
