/* eslint-disable no-console */

const { readFile } = require("fs").promises;
const { diff, minVersion } = require("semver");
const symbols = require("./symbols");

async function reportBreakingChanges(oldDependencies) {
  const packageJson = await readFile("package.json", "utf-8");
  const parsedPackageJson = JSON.parse(packageJson);
  const { devDependencies = {}, dependencies = {} } = parsedPackageJson;
  const newDependencies = { ...devDependencies, ...dependencies };

  for (const [packageName, newVersion] of Object.entries(newDependencies)) {
    const oldVersion = oldDependencies[packageName];
    if (diff(minVersion(newVersion), minVersion(oldVersion)) === "major") {
      console.log(
        symbols.warning,
        `${packageName} updated from ${oldVersion} to ${newVersion}`
      );
    }
  }
}

module.exports = reportBreakingChanges;
