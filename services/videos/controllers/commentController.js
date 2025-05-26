const Comment = require('../models/Comments');

// POST /videos/:id/comments
exports.postComment = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userId; 
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    let comment = await Comment.create({ videoId, userId, text });
    //this is done so that as soon as user post comment we get the populated data as need in frontend

    comment = await comment.populate('userId', 'username');
    
    res.status(201).json({ message: 'Comment posted', comment });
  } catch (err) {
    console.error('Error posting comment:', err); 
    res.status(500).json({ error: 'Failed to post comment' });
  }
};

// GET /videos/:id/comments
exports.getComments = async (req, res) => {
  try {
    const videoId = req.params.id;

    const comments = await Comment.find({ videoId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// DELETE /comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
