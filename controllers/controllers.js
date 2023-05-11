const {
  fetchTopicsData,
  fetchAPIsData,
  getCommentsById,
  fetchCommentsById,
} = require("../models/models");

exports.getTopics = (req, res) => {
  fetchTopicsData()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAPIs = (req, res, next) => {
  fetchAPIsData()
    .then((APIs) => {
      res.status(200).send(APIs);
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
