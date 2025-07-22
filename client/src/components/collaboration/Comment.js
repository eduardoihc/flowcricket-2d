import React, { useState } from 'react';

const Comment = ({ comment, onReply, onResolve, userRole }) => {
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const canResolve = userRole === 'Admin' || userRole === 'Grilo';

  return (
    <div style={{ border: '1px solid #ddd', padding: '5px', margin: '5px' }}>
      <p>
        <strong>{comment.author}</strong> ({comment.role}): {comment.text}
      </p>
      {comment.replies && comment.replies.length > 0 && (
        <button onClick={() => setShowReplies(!showReplies)}>
          {showReplies ? 'Hide' : 'Show'} Replies ({comment.replies.length})
        </button>
      )}
      {showReplies && (
        <div>
          {comment.replies.map((reply) => (
            <div key={reply.id} style={{ marginLeft: '15px' }}>
              <p>
                <strong>{reply.author}</strong> ({reply.role}): {reply.text}
              </p>
            </div>
          ))}
        </div>
      )}
      <input
        type="text"
        placeholder="Reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <button onClick={() => onReply(comment.id, replyText)}>Reply</button>
      {canResolve && !comment.resolved && (
        <button onClick={() => onResolve(comment.id)}>Resolve</button>
      )}
      {comment.resolved && <span> (Resolved)</span>}
    </div>
  );
};

export default Comment;
