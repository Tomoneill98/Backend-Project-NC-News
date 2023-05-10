const connection = require("../db/connection");
const fs = require("fs/promises");

exports.fetchTopicsData = () => {
  return connection.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchAPIsData = () => {
  return fs.readFile("endpoints.json", "utf-8").then((result) => {
    return JSON.parse(result);
  });
};

exports.fetchArticlesById = (article_id) => {
  console.log("in model");
  return connection
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Error - invalid article ID",
        });
      }
      return result.rows[0];
    });
};
