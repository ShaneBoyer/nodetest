var express = require('express');

function home(req, res) {
  res.render(__dirname + '/home', { navactive: "home" });
}

function tour(req, res) {
  res.render(__dirname + '/tour', { navactive: "tour" });
}

function theApp(req, res) {
  res.render(__dirname + '/spa');
}

function setup(app) {
	app.get('/', home);
	app.get('/tour', tour);
  //app.post('/login', passport.authenticate('local', {successRedirect: '/app', failureRedirect: '/login', failureFlash: true }));
  app.get('/app', theApp);
  app.get('/partials/:name', function (req, res) {
    var name = req.params.name;
    res.render(__dirname + '/partials/' + name);
  });
}

module.exports = setup;
