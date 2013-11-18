// web site HTML routes
var express = require('express');

function home(req, res) {
	res.render(__dirname + '/home');
}

function setup(app) {
	app.get('/', home);
}

module.exports = setup;
