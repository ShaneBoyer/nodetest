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

// TODO: replace this with passport, use hashes
function loginUser(req, res, next) {
	var username = req.params.username;
	var password = req.params.password;
  if (username && password) {
    db.connect(function(err, client, done) {
			if (err) { next(err); return; }
      db.query(client, 'SELECT * FROM user_ WHERE username = $1 AND password = $2', [username, password], done, function(err, result) {
				if (err) { next(err); return; }
        if (result.rows.length == 1) {
          req.params.id = result.rows[0].id;
          getUser(req, res); // return authenticated user
        } else {
          return db.jsonResponse(res, 404, null);
        }
      });
    });
  } else {
    return db.jsonResponse(res, 400, null);
  }
}

function getUsers(req, res, next) {
  db.connect(function(err, client, done) {
		if (err) { next(err); return; }
    db.query(client, 'SELECT * FROM user_', null, done, function(err, result) {
			if (err) { next(err); return; }
      db.jsonResponse(res, 200, result.rows);
    });
  });
}

function getUser(req, res, next) {
	var id = req.params.id;
  if (id && ! isNaN(id)) {
    db.connect(function(err, client, done) {
			if (err) { next(err); return; }
      db.query(client, 'SELECT * FROM user_ WHERE id = $1', [id], done, function(err, result) {
				if (err) { next(err); return; }
        if (result.rows.length == 0) {
					var error = new Error('Not Found'); error.status = 404;
					next(error);
					return;
        } else {
          db.jsonResponse(res, 200, result.rows);
        }
      });
    });
  } else {
		var error = new Error('Not Found'); error.status = 404;
		next(error);
		return;
  }
}

function editUser(req, res, next) {
	var id = req.params.id;
  if (! id || isNaN(id)) {
    return db.jsonResponse(res, 404, null);
  }
  
  var data = req.body;
    // TODO: validation
  if (data) {
    db.connect(function(err, client, done) {
      var sql = 'UPDATE user_ SET company_fk = $2, username = $3, password = $4, first_name = $5, last_name = $6, confirmed = $7, email = $8 WHERE id = $1';
      db.query(client, sql, [id, data.company_fk, data.username, data.password, data.first_name, data.last_name, data.confirmed, data.email], done, function(err, result) {
        getUser(req, res); // return updated user
      });
    });
  } else {
    return db.jsonResponse(res, 400, null);
  }
}

function addUser(req, res, next) {
  db.connect(function(err, client, done) {
    var data = req.body;
    // TODO: validation
    if (data) {
      var sql = 'INSERT INTO user_ (company_fk, username, password, first_name, last_name, confirmed, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
      db.query(client, sql, [data.company_fk, data.username, data.password, data.first_name, data.last_name, data.confirmed, data.email], done, function(err, result) {
        var newId = result.rows[0].id;
        req.params.id = newId;  // stuff new id into request then call getUser() to return the new user
        getUser(req, res);
      });
    } else {
      return db.jsonResponse(res, 400, null);
    }
  });
}

function deleteUser(req, res, next) {
	var id = req.params.id;
  if (id && ! isNaN(id)) {
    db.connect(function(err, client, done) {
      db.query(client, 'DELETE FROM user_ WHERE id = $1', [id], done, function(err, result) {
        db.jsonResponse(res, 200, null);
      });
    });
  } else {
    return db.jsonResponse(res, 404, null);
  }
}
