var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('oauth_client', { id: { autoIncrement: true, type: 'int', primaryKey: true }, name: { type: 'string', notNull: true }, 
                client_id: { type: 'string', notNull: true, unique: true }, client_secret: { type: 'string', notNull: true } }, 
                addClients);
  function addClients(err) {
    if (err) { callback(err); return; }
    db.insert('oauth_client', [ "name", "client_id", "client_secret" ], [ "ExecuKey Web Application", "execukey-web", "secret" ], callback);
  };
};

exports.down = function(db, callback) {
  db.dropTable('oauth_client', callback);
};
