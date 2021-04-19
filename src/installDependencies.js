const spawnPromise = require("./spawnPromise");

function installDependencies(
  packageManager,
  dependencies,
  development = false
) {
  const args = [];

  if (packageManager === "yarn") {
    args.push("add");
  } else {
    args.push("install");
  }

  args.push(...Object.keys(dependencies));

  if (development) {
    args.push("-D");
  }

  return spawnPromise(packageManager, args);
}

module.exports = installDependencies;
