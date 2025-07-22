import React, { useState, useEffect } from 'react';
import Login from './components/user-management/Login';
import AdminDashboard from './components/dashboard/AdminDashboard';
import GriloDashboard from './components/dashboard/GriloDashboard';
import ClientDashboard from './components/dashboard/ClientDashboard';
import { logActivity } from './services/activityLog';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleUpload = (newPiece) => {
    setPieces([...pieces, { ...newPiece, id: pieces.length + 1, comments: [] }]);
    logActivity(user, 'Upload', `Uploaded piece "${newPiece.name}"`);
  };

  const handleApprove = (pieceId) => {
    const piece = pieces.find((p) => p.id === pieceId);
    setPieces(
      pieces.map((p) =>
        p.id === pieceId ? { ...p, status: 'Approved' } : p
      )
    );
    logActivity(user, 'Approval', `Approved piece "${piece.name}"`);
  };

  const onRequestChange = (pieceId) => {
    const piece = pieces.find((p) => p.id === pieceId);
    setPieces(
      pieces.map((p) =>
        p.id === pieceId ? { ...p, status: 'Changes Requested' } : p
      )
    );
    logActivity(user, 'Change Request', `Requested changes for piece "${piece.name}"`);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderDashboard = () => {
    if (!user) {
      return <Login setUser={setUser} />;
    }

    const dashboardProps = {
      user,
      pieces,
      onApprove: handleApprove,
      onRequestChange: onRequestChange,
      onUpload: handleUpload,
    };

    switch (user.role) {
      case 'Admin':
        return <AdminDashboard {...dashboardProps} />;
      case 'Grilo':
        return <GriloDashboard {...dashboardProps} />;
      case 'Client':
        return <ClientDashboard {...dashboardProps} />;
      default:
        return <Login setUser={setUser} />;
    }
  };

  return (
    <div className={`App ${theme}`}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      {renderDashboard()}
    </div>
  );
}

export default App;
