module.exports = {
  setup: privateSetup,
  connect: privateConnect,
  query: privateQuery,
  jsonResponse: privateJsonResponse,
  errorResponse: privateErrorResponse
};

var pg = null;

function privateSetup(database) {
  pg = database;
}

function privateConnect(callback) {
  pg.connect(function(err, client, done) {
    if (err) {
      console.error('DB connect error: %s', err);
      var e = new Error('Database connect error'); e.status = 500;
      callback(e);
      return;
    }
    
    callback(null, client, done);
  });
}

// returns result set object
function privateQuery(client, sql, parameters, done, callback) {
    client.query(sql, parameters, function(err, result) {
      done();
      if (err) {
        console.error('SQL query error (%s): %s', sql, err);
        var e = new Error('Query error'); e.status = 500;
        callback(e);
        return;
      }
      
      callback(null, result);
    });
}

// validationErrors is optional, format: "errors" : [ { "code" : 5432, "field" : "first_name", "message" : "First name cannot have fancy characters"} ]
function privateErrorResponse(response, httpcode, errorcode, msg, validationErrors) {
  var json = { code: errorcode, message: msg };   // TODO: validationErrors
  response.writeHead(httpcode, {'content-type':'application/json', 'content-length': json.length});
  response.end(JSON.stringify(json));
}

function privateJsonResponse(response, httpcode, obj) {
  if (obj) {
    var json = JSON.stringify(obj);
    response.writeHead(httpcode, {'content-type':'application/json', 'content-length': json.length});
    response.end(json);
  } else {
    response.writeHead(httpcode);
    response.end();
  }
}
