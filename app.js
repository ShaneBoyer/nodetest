#!/usr/bin/env node
////////// modules
var config = require('./config'), express = require('express');
var app = express();
var dbUrl = config.db.url;
console.info('connString = %s', dbUrl);

var pg = require("pg");
pg.defaults.user = config.db.user;
pg.defaults.database = config.db.database;
pg.defaults.password = config.db.password;
pg.defaults.host = config.db.host;
pg.defaults.port = config.db.port;

////////// config
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'all good things come to those who wait' }));

if (! config.env.PRODUCTION) {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if (config.env.PRODUCTION) {
	app.use(express.errorHandler());
}


///// Routes
[
  "./api/routes",
  "./site/routes"
].forEach(function (routePath) {
    require(routePath)(app, pg);
});

app.use(app.router);

// TODO: error handlers

////// Start server
app.listen(config.express.port, config.express.ip, function(error) {
	if (error) {
		console.error("Express startup failed: %s", error);
		process.exit(10);
	}
	console.info("Express server listening at %s in %s mode", config.express.ip + ":" + config.express.port, app.settings.env);
});
