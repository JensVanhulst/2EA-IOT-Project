/** @format */

/**
 * Express router to update data from database
 * @module route/Update
 * @requires express
 * @requires connection
 * @exports router
 * @example /api/update?type=data&val=19&id=SENSOR_002_LIGHT&time=2019-11-25 18:42:29
 * @example /api/update?type=sensor&newid=SENSOR_002_LIGHT&id=SENSOR_003_TEST
 *
 */

const express = require("express");
const connection = require("../database");

/**
 * Express router to mount operation functions on.
 * @type {object}
 * @var
 */
const router = express.Router();

//put = update data
/**
 * Route to update the data into the sql database
 * @name router/put
 * @function
 * @memberof module:route/Update
 * @inner
 * @param {string} path - Express path
 * @param {callback} req - Express middleware.
 * @param {callback} res - HTTP response argument to the middleware function
 * @param {callback} next - HTTP request argument to the middleware function
 */
router.put("/", function(req, res, next) {
  switch (req.query.type) {
    case "data":
      /** @var {String} sql - Formates the SQL string from the request */
      var sql = `UPDATE SensorData SET Value = '${req.query.val}' WHERE ID='${req.query.id}' AND Timestamp='${req.query.time}'`;

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
          return console.error("Error: " + error.message);
        } else {
          res.sendStatus(200);
        }
      });
      break;

    case "sensor":
      //Update value of a measurement
      var sql = `UPDATE SensorOverview SET ID = '${req.query.newid}' WHERE ID='${req.query.oldid}'`;
      connection.query(sql, function(error, result) {
        if (error) {
          return console.error("Error: " + error.message);
        } else {
          res.sendStatus(200);
        }
      });
      break;

    case "lkv":
      var sql = `UPDATE SensorOverview SET Value = '${req.query.val}' , Timestamp = '${req.query.time}' WHERE ID='${req.query.id}';`;
      connection.query(sql, function(error, result) {
        if (error) {
          res.send("LOL");
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
