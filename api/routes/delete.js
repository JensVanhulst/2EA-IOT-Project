/** @format */

/**
 * Express router to delete data from database
 * @module route/Delete
 * @requires express
 * @requires connection
 * @exports router
 * @example /api/delete?type=table&table=SensorOverview
 * @example /api/delete?type=sensor&id=SENSOR_001_TEMP
 * @example /api/delete?type=data&id=SENSOR_002_LIGHT&val=29&time=2019-12-12 19:43:22
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
 * Route to insert the data into the sql database
 * @name router/delete
 * @function
 * @memberof module:route/Delete
 * @inner
 * @param {string} path - Express path
 * @param {callback} req - Express middleware.
 * @param {callback} res - HTTP response argument to the middleware function
 * @param {callback} next - HTTP request argument to the middleware function
 */
router.delete("/", function(req, res, next) {
  switch (req.query.type) {
    case "table":
      /** @var {String} sql - Formates the SQL string from the request */
      var sql = `DELETE FROM ${req.query.table}`;

      /**
       * Connection.query function
       * @name connection-query
       * @function
       * @param {string} sql - Express path
       * @param {callback} error - Takes the error
       * @param {callback} result - Takes the result
       */
      connection.query(sql, (error, result) => {
        if (error) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
      break;

    case "sensor":
      //Delete a sensor with specified id
      var sql = `DELETE FROM SensorOverview WHERE ID='${req.query.id}'`;
      connection.query(sql, (error, result) => {
        if (error) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
      break;

    case "data":
      // Delete a specific value from the sensor data
      var sql = `DELETE FROM SensorData WHERE ID='${req.query.id}' AND Value = '${req.query.val}' AND Timestamp = '${req.query.time}'`;
      connection.query(sql, (error, result) => {
        if (error) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
      break;

    default:
      res.sendStatus(500);
      break;
  }
});

module.exports = router;
