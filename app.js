// This is the server
const express = require("express");
const app = express();
const { getTopics } = require("./controllers/controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Error - invalid endpoint" });
});

module.exports = app;
