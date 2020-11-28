/** @format */

/**
 * Express router to add data to the database
 * @module route/Add
 * @requires express
 * @requires connection
 * @exports router
 * @example /api/add?type=data&id=SENSOR_005_TEST&val=12&time=2019-12-12 16:38:29
 * @example /api/add?type=sensor&id=SENSOR_001_TEMP&brand=Raspberry&ip=192.168.1.1&val=0&time=2019-12-12 16:38:21
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
 * @name router/post
 * @function
 * @memberof module:route/Add
 * @inner
 * @param {string} path - Express path
 * @param {callback} req - Express middleware.
 * @param {callback} res - HTTP response argument to the middleware function
 * @param {callback} next - HTTP request argument to the middleware function
 */
router.post("/", function(req, res, next) {
  switch (req.query.type) {
    case "sensor":
      /** @var {String} sql - Formates the SQL string from the request */
      var sql = `INSERT INTO SensorOverview (ID, Brand, IP, Value, Timestamp) VALUES ('${req.query.nid}', '${req.query.brand}', '${req.query.ip}',  '${req.query.val}', '${req.query.time}')`;

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

    case "data":
      var sql = `INSERT INTO SensorData (ID, Value, Timestamp) VALUES ('${req.query.id}', '${req.query.val}', '${req.query.time}')`;
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
