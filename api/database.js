/** @format */

var mysql = require("mysql");
var moment = require("moment");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "-----",
  database: "PXL-IOT",
  timezone: "UTC",
  typeCast: function(field, next) {
    if (field.type == "DATETIME") {
      return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
    }
    return next();
  }
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;
