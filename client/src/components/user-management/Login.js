import React, { useState } from 'react';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    // For simplicity, we'll use a hardcoded user object
    // In a real application, you would fetch user data from a server
    const user = {
      username,
      role: getRole(username),
    };
    setUser(user);
  };

  const getRole = (username) => {
    if (username.toLowerCase().includes('admin')) {
      return 'Admin';
    } else if (username.toLowerCase().includes('grilo')) {
      return 'Grilo';
    } else {
      return 'Client';
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
