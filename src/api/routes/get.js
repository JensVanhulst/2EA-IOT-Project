/** @format */

/**
 * Express router to get data from database
 * @module route/Get
 * @requires express
 * @requires connection
 * @exports router
 * @example /api/get?table=SensorData
 * @example /api/get?table=SensorData&id=SENSOR_002_LIGHT
 * @example /api/get?table=SensorData&id=SENSOR_001_TEMP
 */

const express = require("express");
const connection = require("../database");

/**
 * Express router to mount operation functions on.
 * @type {object}
 * @var
 */
const router = express.Router();

/**
 * Route to get the data into the sql database
 * @name router/get
 * @function
 * @memberof module:route/Get
 * @inner
 * @param {string} path - Express path
 * @param {callback} req - Express middleware.
 * @param {callback} res - HTTP response argument to the middleware function
 * @param {callback} next - HTTP request argument to the middleware function
 */
router.get("/", function(req, res, next) {
  switch (req.query.id) {
    case undefined:
      /** @var {String} sql - Formates the SQL string from the request */
      var sql = `SELECT * FROM ${req.query.table}`;

      /**
       * Connection.query function
       * @name connection-query
       * @function
       * @param {string} sql - Express path
       * @param {callback} error - Takes the error
       * @param {callback} result - Takes the result
       */
      connection.query(sql, function(error, result) {
        if (error) {
          res.sendStatus(500);
        } else {
          res.json(result);
        }
      });
      break;

    case "SENSOR_001_TEMP":
    case "SENSOR_002_LIGHT":
      var sql = `SELECT * FROM SensorData WHERE ID = '${req.query.id}'`;
      connection.query(sql, function(error, result) {
        if (error) {
          res.sendStatus(500);
        } else {
          res.json(result);
        }
      });
      break;

    // case "column":
    //   var sql = `SELECT Timestamp FROM SensorData `;
    //   connection.query(sql, function(error, result) {
    //     if (error) {
    //       res.sendStatus(500);
    //     } else {
    //       res.json(result);
    //     }
    //   });
    //   break;

    case "values":
      var sql = `SELECT Value FROM SensorData `;
      connection.query(sql, function(error, result) {
        if (error) {
          res.sendStatus(500);
        } else {
          res.json(result);
        }
      });
      break;

    case "lkv":
      var sql = `SELECT Value, Timestamp From SensorData WHERE ID = '${req.query.sensor}' ORDER BY Timestamp DESC LIMIT 1;`;
      connection.query(sql, function(error, result) {
        if (error) {
          res.sendStatus(500);
        } else {
          res.json(result);
        }
      });
      break;
    case "custom": 
      var sql = `Select * from SensorData where Timestamp between '${req.query.bdate}' and '${req.query.edate}' ORDER BY Timestamp ASC;`;
      connection.query(sql, function(error, result) {
        if (error) {
          res.sendStatus(500);
        } else {
          res.json(result);
        }
      });
    break;
    default:
      res.sendStatus(500);
      break;
  }
});

module.exports = router;
