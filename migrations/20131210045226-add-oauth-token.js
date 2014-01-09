var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('oauth_token', { id: { type: 'int', autoIncrement: true, primaryKey: true }, expires: { type: 'timestamp' }, 
                                 token: { notNull: true, type: 'string', unique: true }, user_id: 'int', client_id: { type: 'int', notNull: true } }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('oauth_token', callback);
};
