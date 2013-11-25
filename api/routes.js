module.exports = setup;

var users = require('./users');

// cascade route setup to each resource type
function setup(app, database) {
  users(app, database);
}
