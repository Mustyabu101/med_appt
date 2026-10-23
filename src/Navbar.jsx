import React from 'react';

export default function Navbar({ user, onLogout }) {
  const handleLogout = () => {
    const confirmed = window.confirm(
      'Are you sure you want to log out?'
    );

    if (!confirmed) return;

    // Clear saved authentication information.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();

    // Notify the parent application, if a handler was provided.
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        StayHealthy
      </a>

      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="/appointments">Appointments</a>
        <a href="/signup">Sign Up</a>
        <a href="/login">Login</a>

        {user && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
