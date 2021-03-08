/* eslint-disable */
const path = require("path");
const dotenv = require("dotenv");
/* eslint-enable */

dotenv.config({
  silent: true,
  path: path.resolve(process.cwd(), ".env"),
});
