const db = require("../db/connection");
const { checkExists } = require("../utils");
exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          message: "article does not exist",
          status: 404,
        });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by, order) => {
  let queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url";

  const validColumns = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url"]

  if(sort_by){
    if(!validColumns.includes(sort_by, order)){
      return Promise.reject({ status: 400, message : 'Bad request'})
    } else {
      queryStr += ` ORDER BY ${sort_by};`
    }
  } else {
    queryStr += ` ORDER BY created_at;`
  }

  if(order){
    order = order.toUpperCase()
    queryStr=queryStr.slice(0, -1)
    queryStr+= ` ${order};`
  } else {
    queryStr=queryStr.slice(0, -1)
    queryStr+= ` DESC;`
  }
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryProms = [];
  const queryStr =
    "UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *;";
  queryProms.push(db.query(queryStr, [inc_votes, article_id]));
  queryProms.push(checkExists("articles", "article_id", article_id));
  return Promise.all(queryProms).then((output) => {
    return output[0].rows[0];
  });
};
