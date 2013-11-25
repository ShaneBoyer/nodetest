var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_', { id: { autoIncrement: true, type : 'int', primaryKey: true }, company_fk: 'int', username: 'string', password: 'string', first_name: 'string', last_name: 'string', confirmed: 'boolean', email: 'string' }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_', callback);
};
