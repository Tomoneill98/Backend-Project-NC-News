const connection = require("../db/connection");
const fs = require("fs/promises");
const {
  checkCommentsExists,
  checkArticleExists,
} = require("../db/seeds/utils");

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

exports.fetchArticles = () => {
  return connection
    .query(
      `SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticlesById = (article_id) => {
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

//task 6
exports.fetchCommentsById = (article_id) => {
  return checkCommentsExists(article_id).then(() => {
    return connection
      .query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
        [article_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

// task 7
exports.insertComment = (newComment, article_id) => {
  const { username, body } = newComment;
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Error - please enter username or comment",
    });
  }
  return connection
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *; `,
      [username, body, article_id]
    )
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

// task 8
// exports.patchVotesById = (article_id, inc_votes) => {
//   console.log("in model");
//   let selectQuer = `
//   UPDATE articles
//   SET votes = votes + $1
//   WHERE article_id = $2
//   RETURNING *;
//   `;
//   if (typeof inc_votes !== "number") {
//     return Promise.reject({ status: 400, msg: "Incorrect data type" });
//   }
//   return checkArticleExists(article_id).then(() => {
//     return connection.query(selectQuer, [inc_votes, article_id]).then((res) => {
//       return res.rows[0];
//     });
//   });
// };
exports.patchVotesById = (article_id, inc_votes) => {
  let selectQuery = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
  `;

  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Incorrect data type" });
  }

  return checkArticleExists(article_id)
    .then(() => {
      return connection.query(selectQuery, [inc_votes, article_id]);
    })
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return res.rows[0];
    });
};
