#!/usr/bin/env node
////////// modules
var config = require('./config'), express = require('express'), pg = require("pg"), log = require("npmlog");
var connString = config.db.url;
var app = express();

log.level = config.env.logLevel;
log.info('connString = ' + connString);

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
    require(routePath)(app);
});

app.use(app.router);

// TODO: error handlers

////// Start server
app.listen(config.express.port, config.express.ip, function(error) {
	if (error) {
		console.log("Express startup failed: " + error);
		process.exit(10);
	}
	console.log("Express server listening at %s in %s mode", config.express.ip + ":" + config.express.port, app.settings.env);
});
