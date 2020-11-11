/** @format */
/**
 * Express index route
 * @module index
 * @requires express
 * @exports router
 */

const express = require("express");

/**
 * Express router to mount operation functions on.
 * @type {object}
 * @var
 * @namespace Router
 */
const router = express.Router();

router.get("/", function(req, res) {
  res.redirect("http://www.jensvanhulst.tech");
});

module.exports = router;
