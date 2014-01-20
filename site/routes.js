var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var passport = require('passport');

function home(req, res) {
  res.render(__dirname + '/home', { navactive: "home" });
}

function tour(req, res) {
  res.render(__dirname + '/tour', { navactive: "tour" });
}

function login(req, res) {
  res.render(__dirname + '/login');
}

function theApp(req, res) {
  res.render(__dirname + '/spa', { user : req.user } );
}

function setup(app) {
	app.get('/', home);
	app.get('/tour', tour);
  app.get('/login', login);
  app.post('/login', passport.authenticate('local', {successRedirect: '/app', failureRedirect: '/login', failureFlash: true }));
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/app', ensureLoggedIn('/login'), theApp);
  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render(__dirname + '/partials/' + name);
  });
}

module.exports = setup;
