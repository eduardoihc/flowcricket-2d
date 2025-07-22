import React, { useState } from 'react';
import Piece from '../file-handling/Piece';

const ClientDashboard = ({ user, pieces, onApprove, onRequestChange }) => {
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const pendingPieces = pieces.filter(
    (p) => p.status === 'Pending Approval'
  );

  const approvedPieces = pieces.filter((p) => p.status === 'Approved');

  const filteredApprovedPieces = approvedPieces
    .filter((p) =>
      p.name.toLowerCase().includes(filterName.toLowerCase())
    )
    .filter((p) =>
      filterStatus ? p.status === filterStatus : true
    );

  return (
    <div>
      <h2>Client Dashboard</h2>
      <h3>Pieces Pending Approval</h3>
      <div>
        {pendingPieces.map((piece) => (
          <Piece
            key={piece.id}
            piece={piece}
            onApprove={onApprove}
            onRequestChange={onRequestChange}
            user={user}
          />
        ))}
      </div>
      <hr />
      <h3>Approved Pieces</h3>
      <div>
        <input
          type="text"
          placeholder="Filter by name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Changes Requested">Changes Requested</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Last Edited</th>
          </tr>
        </thead>
        <tbody>
          {filteredApprovedPieces.map((piece) => (
            <tr key={piece.id}>
              <td>{piece.name}</td>
              <td>{piece.status}</td>
              <td>{new Date().toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientDashboard;
