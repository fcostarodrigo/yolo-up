const { stat, rmdir, unlink } = require("fs").promises;
const symbols = require("./symbols");

async function tryToRemove(spinner, file) {
  try {
    const stats = await stat(file);
    spinner.start(`Removing ${file}`);

    if (stats.isDirectory()) {
      await rmdir(file, { recursive: true });
    } else {
      await unlink(file);
    }

    spinner.stopAndPersist({ symbol: symbols.success });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

module.exports = tryToRemove;
