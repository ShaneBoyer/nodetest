module.exports = {
  setup: setup,
  findUserById: findUserById,
  findUserByUsername: findUserByUsername,
  findToken: findToken,
  saveToken: saveToken,
  findClientById: findClientById,
  findClientByClientId: findClientByClientId,
  findAuthCode: findAuthCode,
  saveAuthCode: saveAuthCode,
  deleteAuthCode:  deleteAuthCode
};

// temporary
var db = require('../api/db')

function setup(database) {
  db.setup(database);
}

function findUserById(id, callback) {
  if (id && ! isNaN(id)) {
    db.connect(function(err, client, done) {
			if (err) { callback(err); return; }
      db.query(client, 'SELECT * FROM user_ WHERE id = $1', [id], done, function(err, result) {
				if (err) { callback(err); return; }
        if (result.rows.length == 0) {
          return callback(null, null);
        } else {
          return callback(null, result.rows[0]);
        }
      });
    });
  } else {
    var error = new Error('findUserById invalid id parameter'); error.status = 400;
    callback(error);
    return;
  }
}

function findUserByUsername(username, callback) {
  if (username) {
    db.connect(function(err, client, done) {
			if (err) { callback(err); return; }
      db.query(client, 'SELECT * FROM user_ WHERE username = $1', [username], done, function(err, result) {
  			if (err) { callback(err); return; }
        if (result.rows.length == 0) {
          return callback(null, null);
        } else {
          callback(null, result.rows[0]);
					return;
        }
      });
    });
  } else {
    var error = new Error('findUserByUsername invalid username parameter'); error.status = 400;
    callback(error);
    return;
  }
}

function findToken(key, callback) {
  if (key) {
    db.connect(function(err, client, done) {
			if (err) { callback(err); return; }
      db.query(client, 'SELECT * FROM oauth_token WHERE token = $1', [key], done, function(err, result) {
  			if (err) { callback(err); return; }
        if (result.rows.length == 0) {
          return callback(null, null);
        } else {
          callback(null, result.rows[0]);
					return;
        }
      });
    });
  } else {
    var error = new Error('findToken invalid token parameter'); error.status = 400;
    callback(error);
    return;
  }
}

function saveToken(token, userID, clientID, callback) {
  db.connect(function(err, client, done) {
    if (token) {
      var sql = 'INSERT INTO oauth_token (token, user_id, client_id) VALUES ($1, $2, $3) RETURNING id';
      db.query(client, sql, [token, userID, clientID], done, callback);
    } else {
      var error = new Error('saveToken invalid parameter'); error.status = 400;
      callback(error);
      return;
    }
  });  
}


/////// auth codes not used
function findAuthCode(key, done) {
  return done(null, null);
};

function saveAuthCode(code, clientID, redirectURI, userID, done) {
  return done(null);
};

function deleteAuthCode(key, done) {
    return done(null);
}


/////// clients
function findClientById(id, callback) {
    db.connect(function(err, client, done) {
			if (err) { callback(err); return; }
      db.query(client, 'SELECT * FROM oauth_client WHERE id = $1', [id], done, function(err, result) {
  			if (err) { callback(err); return; }
        if (result.rows.length == 0) {
          return callback(null, null);
        } else {
          callback(null, result.rows[0]);
					return;
        }
      });
    });
};

function findClientByClientId(clientId, callback) {
    db.connect(function(err, client, done) {
			if (err) { callback(err); return; }
      db.query(client, 'SELECT * FROM oauth_client WHERE client_id = $1', [clientId], done, function(err, result) {
  			if (err) { callback(err); return; }
        if (result.rows.length == 0) {
          return callback(null, null);
        } else {
          callback(null, result.rows[0]);
					return;
        }
      });
    });
};
