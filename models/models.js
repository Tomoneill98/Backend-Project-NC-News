const connection = require("../db/connection");

exports.fetchTopicsData = () => {
  return connection.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};
