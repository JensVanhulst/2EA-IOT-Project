/** @format */

/**
 * Express main app
 * @module app
 * @requires express
 * @requires cookieParser
 * @requires logger
 * @requires getRouter
 * @requires addRouter
 * @requires deleteRouter
 * @requires updateRouter
 * @exports app
 */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const getRouter = require("./routes/get");
const addRouter = require("./routes/add");
const deleteRouter = require("./routes/delete");
const updateRouter = require("./routes/update");
const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  res.set("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-type, Authorization");
  res.set("Access-Control-Allow-Origin", "http://www.jensvanhulst.tech");
  next();
});

app.use("/", indexRouter);
app.use("/get", getRouter);
app.use("/add", addRouter);
app.use("/delete", deleteRouter);
app.use("/update", updateRouter);

module.exports = app;
