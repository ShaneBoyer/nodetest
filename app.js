#!/usr/bin/env node
////////// modules
var config = require('./config'), express = require('express'), flash = require('connect-flash'), passport = require('passport');
var app = express();
var dbUrl = config.db.url;
console.info('connString = %s', dbUrl);

var pg = require("pg");
pg.defaults.user = config.db.user;
pg.defaults.database = config.db.database;
pg.defaults.password = config.db.password;
pg.defaults.host = config.db.host;
pg.defaults.port = config.db.port;

var oauth2 = require('./auth/oauth2');
oauth2.setup(pg);

////////// config
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ cookie: { maxAge: 60000 }, secret: 'all good things come to those who wait' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require('./auth/auth');

if (! config.env.PRODUCTION) {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else {
	app.use(express.errorHandler());
}


///// Routes
[
  "./api/routes",
  "./site/routes"
].forEach(function (routePath) {
    require(routePath)(app, pg);
});

// oauth 2 routes
//app.get('/oauth/authorize', oauth2.authorization);
//app.post('/oauth/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

//////// TEMP
app.get('/api/userinfo', passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope })
  });

app.use(app.router);

////// error handlers

// 404 - no other route matched
app.use(function(req, res, next) {
	console.info('404 handler called, res = ' + (res ? 'non-null' : 'null'));
  res.status(404);
  if (req.accepts('json')) {
    res.send({ code: (res.status || 500), message: 'Not Found' });
  } else if (req.accepts('html')) {
    res.render('Not Found', { url: req.url });
  } else {
    res.type('txt').send('Error: Not Found');  
  }
  
  return;
});

// general error handling middleware invoked by connect
app.use(function(err, req, res, next) {
	console.error('general error handler called: ' + err.message + ', res = ' + (res ? 'non-null' : 'null'));
  res.status(err.status || 500);

  if (req.accepts('json')) {
    res.send({ code: (err.status || 500), message: err.message });
  } else if (req.accepts('html')) {
    res.render('Error: ' + err.message, { url: req.url });
  } else {
    res.type('txt').send('Error: ' + err.message);  
  }
  
  return;
});


////// Start server
app.listen(config.express.port, config.express.ip, function(error) {
	if (error) {
		console.error("Express startup failed: %s", error);
		process.exit(10);
	}
	console.info("Express server listening at %s in %s mode", config.express.ip + ":" + config.express.port, app.settings.env);
});
