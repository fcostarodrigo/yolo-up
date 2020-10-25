/* eslint-disable no-console */

const fs = require("fs").promises;
const { spawn } = require("child_process");

function spawnPromise(command, args, options) {
  return new Promise((resolve, reject) => {
    spawn(command, args, options).on("close", (code) =>
      code === 0 ? resolve(code) : reject(code),
    );
  });
}

async function removeTry(file) {
  try {
    const stat = await fs.stat(file);
    console.log(`Removing ${file}`);

    if (stat.isDirectory()) {
      await fs.rmdir(file, { recursive: true });
    } else {
      await fs.unlink(file);
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(error);
    }
  }
}

async function yoloUp({ projectRoot }) {
  process.chdir(projectRoot);

  const packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"));
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  const dependencies = Object.keys(packageJson.dependencies || {});

  await removeTry("node_modules");
  await removeTry("package-lock.json");

  console.log("Removing dependencies from package.json");
  packageJson.dependencies = {};
  packageJson.devDependencies = {};
  await fs.writeFile("package.json", JSON.stringify(packageJson, null, 2));

  console.log("Installing dependencies");
  await spawnPromise("npm", ["install", ...dependencies], { stdio: "inherit" });

  console.log("Installing dev dependencies");
  await spawnPromise("npm", ["install", ...devDependencies, "--save-dev"], {
    stdio: "inherit",
  });
}

module.exports = yoloUp;
