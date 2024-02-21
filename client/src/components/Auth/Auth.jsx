import React, { useState } from 'react';
import "./Auth.css"
const LoginForm = ({ onSwitchTab }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    console.log('Login submitted:', { username, password });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <button onClick={() => onSwitchTab('signup')}>Sign Up</button>
      </p>
    </div>
  );
};

const SignupForm = ({ onSwitchTab }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // Add your account creation logic here
    console.log('Account created:', { newUsername, newPassword });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account? <button onClick={() => onSwitchTab('login')}>Login</button>
      </p>
    </div>
  );
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {activeTab === 'login' ? <LoginForm onSwitchTab={handleSwitchTab} /> : <SignupForm onSwitchTab={handleSwitchTab} />}
    </div>
  );
};

export default Auth;
