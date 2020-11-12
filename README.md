# Yolo Up

Update dependencies of a npm package.

- Delete `node_packages`, `package-lock.json`, list all dependencies and install them again to the latest version.

## Setup

```bash
npm install yolo-up -g
```

## Usage

```
yolo-up [projectRoot]

Positionals:
  projectRoot  Path of project root                      [string] [default: "."]

Options:
  --help            Show help                                          [boolean]
  --version         Show version number                                [boolean]
  --packageManager  Package manager
           [string] [choices: "npm", "yarn", "pnpm", "infer"] [default: "infer"]
```

## Changelog

[Change Log](CHANGELOG.MD)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
