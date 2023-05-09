const { fetchTopicsData } = require("../models/models");

exports.getTopics = (req, res) => {
  fetchTopicsData().then((topics) => {
    res.status(200).send(topics);
  });
};
