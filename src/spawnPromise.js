const { spawn } = require("child_process");

function spawnPromise(command, args, options) {
  return new Promise((resolve, reject) => {
    spawn(command, args, options).on("close", (code) =>
      code === 0 ? resolve(code) : reject(code),
    );
  });
}

module.exports = spawnPromise;
