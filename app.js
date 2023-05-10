// This is the server
const express = require("express");
const app = express();
const {
  getTopics,
  getAPIs,
  getArticles,
} = require("./controllers/controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getAPIs);

// task 5
app.get("/api/articles", getArticles);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Error - invalid endpoint" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
