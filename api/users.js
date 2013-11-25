module.exports = setup;

var db = require('./db');

function setup(app, database) {
  db.setup(database);
	app.get('/api/v1/users', getUsers);
	app.get('/api/v1/users/:id', getUser);
	app.put('/api/v1/users/:id', editUser);
  app.post('/api/v1/users', addUser);
  app.delete('/api/v1/users/:id', deleteUser);
}

function getUsers(req, res) {
  db.connect(function(client, done) {
    db.query(res, client, 'SELECT * FROM user_', null, done, function(result) {
      db.jsonResponse(res, 200, result.rows);
    });
  });
}

function getUser(req, res) {
	var id = req.params.id;
  if (id && ! isNaN(id)) {
    db.connect(res, function(client, done) {
      db.query(res, client, 'SELECT * FROM user_ WHERE id = $1', [id], done, function(result) {
        if (result.rows.length == 0) {
          return db.jsonResponse(res, 404, null);
        } else {
          db.jsonResponse(res, 200, result.rows);
        }
      });
    });
  } else {
    return db.jsonResponse(res, 404, null);
  }
}

function editUser(req, res) {
	var id = req.params.id;
  if (! id || isNaN(id)) {
    return db.jsonResponse(res, 404, null);
  }
  
  var data = req.body;
    // TODO: validation
  if (data) {
    db.connect(res, function(client, done) {
      var sql = 'UPDATE user_ SET company_fk = $2, username = $3, password = $4, first_name = $5, last_name = $6, confirmed = $7, email = $8 WHERE id = $1';
      db.query(res, client, sql, [id, data.company_fk, data.username, data.password, data.first_name, data.last_name, data.confirmed, data.email], done, function(result) {
        getUser(req, res); // return updated user
      });
    });
  } else {
    return db.jsonResponse(res, 400, null);
  }
}

function addUser(req, res) {
  db.connect(res, function(client, done) {
    var data = req.body;
    // TODO: validation
    if (data) {
      var sql = 'INSERT INTO user_ (company_fk, username, password, first_name, last_name, confirmed, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
      db.query(res, client, sql, [data.company_fk, data.username, data.password, data.first_name, data.last_name, data.confirmed, data.email], done, function(result) {
        var newId = result.rows[0].id;
        req.params.id = newId;  // stuff new id into request then call getUser() to return the new user
        getUser(req, res);
      });
    } else {
      return db.jsonResponse(res, 400, null);
    }
  });
}

function deleteUser(req, res) {
	var id = req.params.id;
  if (id && ! isNaN(id)) {
    db.connect(res, function(client, done) {
      db.query(res, client, 'DELETE FROM user_ WHERE id = $1', [id], done, function(result) {
        db.jsonResponse(res, 200, null);
      });
    });
  } else {
    return db.jsonResponse(res, 404, null);
  }
}
