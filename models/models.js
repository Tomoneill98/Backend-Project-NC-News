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

//task 6
exports.fetchCommentsById = (article_id) => {
  return connection
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows) return result.rows;
    });
};
