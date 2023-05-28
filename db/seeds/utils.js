const connection = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkCommentsExists = (article_id) => {
  return connection
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0 && article_id) {
        return Promise.reject({
          status: 404,
          msg: "Error - article doesn't exist",
        });
      }
    });
};

exports.checkArticleExists = (article) => {
  return connection
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
    });
};

exports.checkCommentExists = (comment_id) => {
  return connection
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0 && comment_id) {
        return Promise.reject({
          status: 404,
          msg: "Error - comment doesn't exist",
        });
      }
    });
};
