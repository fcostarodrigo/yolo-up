const { stat } = require("fs").promises;
const lockFiles = require("./lockFiles");

async function inferPackageManager() {
  // @ts-ignore
  for (const [packageManger, lockFile] of lockFiles) {
    try {
      await stat(lockFile);
      return packageManger;
    } catch (error) {
      continue;
    }
  }

  throw new Error("Package manager could not be inferred");
}

module.exports = inferPackageManager;
