/* eslint-disable no-console */

const { readFile, writeFile } = require("fs").promises;
const ora = require("ora");
const reportBreakingChanges = require("./reportBreakingChanges");
const inferPackageManager = require("./inferPackageManager");
const installDependencies = require("./installDependencies");
const tryToRemove = require("./tryToRemove");
const lockFiles = require("./lockFiles");
const symbols = require("./symbols");

const success = { symbol: symbols.success };

async function yoloUp({ projectRoot, packageManager }) {
  const spinner = ora();

  try {
    process.chdir(projectRoot);

    if (packageManager === "infer") {
      spinner.start("Inferring package manager with lock files");
      packageManager = await inferPackageManager();
      spinner.stopAndPersist({
        symbol: symbols.success,
        text: `Using ${packageManager} package manger`,
      });
    }

    spinner.start("Reading package.json");
    const packageJson = await readFile("package.json", "utf-8");
    const parsedPackageJson = JSON.parse(packageJson);
    const { devDependencies = {}, dependencies = {} } = parsedPackageJson;
    spinner.stopAndPersist(success);

    await tryToRemove(spinner, "node_modules");
    await tryToRemove(spinner, lockFiles.get(packageManager));

    spinner.start("Removing dependencies from package.json");
    parsedPackageJson.dependencies = {};
    parsedPackageJson.devDependencies = {};
    await writeFile("package.json", JSON.stringify(parsedPackageJson, null, 2));
    spinner.stopAndPersist(success);

    try {
      spinner.start("Installing dependencies");
      await installDependencies(packageManager, dependencies);
      spinner.stopAndPersist(success);

      spinner.start("Installing dev dependencies");
      await installDependencies(packageManager, devDependencies, true);
      spinner.stopAndPersist(success);

      await reportBreakingChanges({ ...devDependencies, ...dependencies });
    } catch (error) {
      spinner.stopAndPersist({ symbol: symbols.error, text: error.message });
      console.error(error);

      spinner.start("Restoring package.json");
      await writeFile("package.json", packageJson);
      spinner.stopAndPersist({
        symbol: symbols.warning,
        text: "package.json restored",
      });
    }
  } catch (error) {
    spinner.stopAndPersist({ symbol: symbols.error, text: error.message });
    console.error(error);
  }
}

module.exports = yoloUp;
