// web site HTML routes
var express = require('express');

function home(req, res) {
  res.render(__dirname + '/home', { navactive: "home" });
}

function tour(req, res) {
  res.render(__dirname + '/tour', { navactive: "tour" });
}

function setup(app) {
	app.get('/', home);
	app.get('/tour', tour);
}

module.exports = setup;
