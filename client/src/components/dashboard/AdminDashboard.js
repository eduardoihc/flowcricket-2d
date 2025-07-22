import React from 'react';
import { getActivityLog } from '../../services/activityLog';

const AdminDashboard = ({ user }) => {
  const activityLog = getActivityLog();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Activity Log</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {activityLog.map((log, index) => (
            <tr key={index}>
              <td>{log.user}</td>
              <td>{log.role}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{log.timestamp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
