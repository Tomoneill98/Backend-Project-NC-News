const {
  fetchTopicsData,
  fetchAPIsData,
  getCommentsById,
  fetchCommentsById,
  fetchArticles,
  fetchArticlesById,
  insertComment,
} = require("../models/models");

exports.getTopics = (req, res) => {
  fetchTopicsData()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPIs = (req, res, next) => {
  fetchAPIsData()
    .then((APIs) => {
      res.status(200).send({ APIs });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

// task 5
exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

// task 6

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

// task 7

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  console.log(newComment);
  const { article_id } = req.params;
  console.log(article_id);
  console.log("in controller");
  insertComment(newComment, article_id).then((comment) => {
    console.log(comment);
    res.status(201).send({ comment });
  });
};
