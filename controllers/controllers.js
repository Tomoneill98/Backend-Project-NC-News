const { fetchTopicsData, fetchAPIsData } = require("../models/models");

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
