/** @format */

const mysql = require("mysql2");
const moment = require("moment");

const connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  port: "3306",
  password: "d3mo-psw-123%",
  database: "PXL-IOT",
  typeCast: (field, next) => {
    if (field.type == "DATETIME") {
      return moment(field.string()).format("YYYY-MM-DD HH:mm:ss");
    }
    return next();
  },
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected to mysql");
});

module.exports = connection;
