'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

// без constructor, только методы
class CommentService {
  create(offer, comment) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      ...comment
    };

    offer.comments.push(newComment);
    return newComment;
  }

  delete(offer, commentId) {
    const deletedComment = offer.comments
      .find((item) => item.id === commentId);

    if (!deletedComment) {
      return null;
    }

    offer.comments = offer.comments
      .filter((item) => item.id !== commentId);

    return deletedComment;
  }

  find(offer) {
    return offer.comments;
  }

}

module.exports = CommentService;
