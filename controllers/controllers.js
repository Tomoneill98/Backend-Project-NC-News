const {
  fetchTopicsData,
  fetchAPIsData,
  getCommentsById,
  fetchCommentsById,
  fetchArticles,
  fetchArticlesById,
  insertComment,
  patchVotesById,
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
  const { article_id } = req.params;
  insertComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

// task 8

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchVotesById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
      console.log(result);
    })
    .catch((err) => {
      next(err);
    });
};
