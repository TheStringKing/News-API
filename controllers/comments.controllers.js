const {selectCommentsByArticleId, insertComment}=require('../models/comments.models')
exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err)=>{
      next(err)
    })
  };
  exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const {article_id} = req.params;
    insertComment(article_id, newComment).then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err)=>{
      next(err)
    })
  }