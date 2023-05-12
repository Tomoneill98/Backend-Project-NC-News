// This is the server
const express = require("express");
const app = express();
const {
  getTopics,
  getAPIs,
  getCommentsById,
  getArticles,
  getArticlesById,
  postComment,
} = require("./controllers/controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getAPIs);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postComment);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Error - invalid endpoint" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Error - Bad Request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Error - Not Found" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
