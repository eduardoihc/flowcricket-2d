import React from 'react';
import Upload from '../file-handling/Upload';
import Piece from '../file-handling/Piece';

const GriloDashboard = ({ user, pieces, onUpload, onApprove, onRequestChange }) => {
  return (
    <div>
      <h2>Grilo Dashboard</h2>
      <Upload onUpload={onUpload} />
      <div>
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            piece={piece}
            onApprove={onApprove}
            onRequestChange={onRequestChange}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default GriloDashboard;
