var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('company', { id: { autoIncrement: true, type: 'int', primaryKey: true }, name: 'string', logo: 'string'  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('company', callback);
};
