const connection = require("../db/connection");
const fs = require("fs/promises");

exports.fetchTopicsData = () => {
  return connection.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.fetchAPIsData = () => {
  return fs
    .readFile("endpoints.json", "utf-8")
    .then((result) => {
      return JSON.parse(result);
    })
    .then((fileParsed) => {
      return fileParsed;
    });
};
