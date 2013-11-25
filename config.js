var config = module.exports;
var PRODUCTION = process.env.NODE_ENV === "development";

config.env = {
  name: process.env.NODE_ENV || "development",
  PRODUCTION: process.env.NODE_ENV === "development",
  logLevel: 'info'
};

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: "0.0.0.0"
};

config.db = {
  user: 'action',
  password: '',
  host: 'localhost',
  port: '5432',
  database: 'action',
  url: process.env.DB_URL || 'postgres://action:@localhost/action'
};

if (PRODUCTION) {
  //use different db in production here, for example
}

//config.db same deal
//config.email etc
//config.log