const {
  fetchTopicsData,
  fetchAPIsData,
  fetchCommentsById,
  fetchArticles,
  fetchArticlesById,
  insertComment,
  patchVotesById,
  deleteCommentsById,
  fetchUsersData,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
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

// // task 5
// exports.getArticles = (req, res, next) => {
//   const { topic, sort_by, order } = req.query;
//   fetchArticles(topic, sort_by, order)
//     .then((articles) => {
//       res.status(200).send({ articles });
//     })
//     .catch(next);
// };

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";
  fetchArticles(sort_by, order, topicQuery)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
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
    })
    .catch((err) => {
      next(err);
    });
};

// task 9

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentsById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

// task 10

exports.getUsers = (req, res, next) => {
  fetchUsersData()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

// // task 11

// exports.getArticlesByQuery = (req, res, next) => {
//   console.log("in controller");
//   console.log(req.query);
//   const { topic } = req.query;
//   console.log(topic);
//   fetchArticlesByQuery(topic)
//     .then((articles) => {
//       res.status(200).send({ articles });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
