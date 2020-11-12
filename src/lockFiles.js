const lockFiles = new Map([
  ["npm", "package-lock.json"],
  ["yarn", "yarn.lock"],
  ["pnpm", "pnpm-lock.yaml"],
]);

module.exports = lockFiles;
