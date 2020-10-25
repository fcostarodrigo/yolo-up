/* eslint-disable no-console */

const fs = require("fs").promises;
const { spawn } = require("child_process");
const nuke = require("@fcostarodrigo/nuke");

function spawnPromise(command, args, options) {
  return new Promise((resolve, reject) => {
    spawn(command, args, options).on("close", (code) =>
      code === 0 ? resolve(code) : reject(code),
    );
  });
}

async function yoloUp({ projectRoot }) {
  process.chdir(projectRoot);

  const packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"));
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  const dependencies = Object.keys(packageJson.dependencies || {});

  console.log("Removing node modules");
  await nuke("node_modules");

  console.log("Removing package-lock.json");
  await nuke("package-lock.json");

  console.log("Installing dependencies");
  await spawnPromise("npm", ["install", ...dependencies], { stdio: "inherit" });

  console.log("Installing dev dependencies");
  await spawnPromise("npm", ["install", ...devDependencies, "--save-dev"], {
    stdio: "inherit",
  });
}

module.exports = yoloUp;
