import React, { useState } from 'react';
import Comment from '../collaboration/Comment';

const Piece = ({ piece, onApprove, onRequestChange, user }) => {
  const [caption, setCaption] = useState(piece.caption);
  const [comments, setComments] = useState(piece.comments || []);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    const newComment = {
      id: comments.length + 1,
      author: user.username,
      role: user.role,
      text: commentText,
      replies: [],
      resolved: false,
    };
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const handleReply = (commentId, replyText) => {
    const updatedComments = comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            replies: [
              ...c.replies,
              {
                id: c.replies.length + 1,
                author: user.username,
                role: user.role,
                text: replyText,
              },
            ],
          }
        : c
    );
    setComments(updatedComments);
  };

  const handleResolve = (commentId) => {
    setComments(
      comments.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
    );
  };

  const visibleComments =
    user.role === 'Client'
      ? comments.filter((c) => c.role === 'Client')
      : comments;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>Piece: {piece.name}</h3>
      <p>Status: {piece.status}</p>
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <div>
        {piece.files.map((file, index) => (
          <div key={index} style={{ position: 'relative' }}>
            {file.type.startsWith('image/') && (
              <img src={URL.createObjectURL(file)} alt={file.name} width="200" />
            )}
            {file.type.startsWith('video/') && (
              <video src={URL.createObjectURL(file)} width="200" controls />
            )}
          </div>
        ))}
      </div>
      <button onClick={() => onApprove(piece.id)}>Approve</button>
      <button onClick={() => onRequestChange(piece.id)}>Request Change</button>

      <div>
        <h4>Comments</h4>
        {visibleComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onResolve={handleResolve}
            userRole={user.role}
          />
        ))}
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default Piece;
