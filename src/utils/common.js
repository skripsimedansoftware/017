const fs = require('node:fs');
const path = require('node:path');

/**
 * Reads and parses the package.json file from the current working directory.
 *
 * @returns {object} The parsed content of the package.json file.
 * @throws {Error} If the package.json file cannot be read or parsed.
 */
const getPackageJSON = () => {
  const packageJSON = fs.readFileSync(path.join(process.cwd(), 'package.json'));
  return JSON.parse(packageJSON.toString());
};

module.exports = { getPackageJSON };
