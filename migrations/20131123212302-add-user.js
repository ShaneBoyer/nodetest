var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_', { id: { type : 'int', primaryKey: true }, companyFK: 'int', username: 'string', password: 'string', firstName: 'string', lastName: 'string', confirmed: 'boolean', email: 'string' }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_', callback);
};
