var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BasicStrategy = require('passport-http').BasicStrategy
  , ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , db = require('./db')


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.findUserByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'User not found' } ); }
      if (user.password != password) { return done(null, false, { message: 'Invalid Username or Password' } ); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.findUserById(id, function(err, user) {
    if (err) { return done(err); }
    return done(null, user);
  });
});


/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
  function(username, password, done) {
  console.info('BasicStrategy called');
    db.findClientByClientId(username, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
//      if (client.client_secret != password) { return done(null, false); }
      return done(null, client);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {
  console.info('ClientPasswordStrategy called');
    db.findClientByClientId(clientId, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
//      if (client.client_secret != clientSecret) { return done(null, false); }
      return done(null, client);
    });
  }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate users based on an access token (aka a
 * bearer token).  The user must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function(accessToken, done) {
  console.info('BearerStrategy called');
    db.findToken(accessToken, function(err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }
      
      db.findUserById(token.userID, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        // to keep this example simple, restricted scopes are not implemented,
        // and this is just for illustrative purposes
        var info = { scope: '*' }
        done(null, user, info);
      });
    });
  }
));
