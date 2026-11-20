import { useState } from 'react';

export default function Navbar({ user, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    const confirmed = window.confirm(
      'Are you sure you want to log out?'
    );

    if (!confirmed || loggingOut) return;

    setLoggingOut(true);
    setError('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Unable to log out. Please try again.');
      }

      // Remove any authentication data left by older versions.
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');

      // Notify the application so React can clear its user state.
      if (typeof onLogout === 'function') {
        await onLogout();
      } else {
        window.location.assign('/');
      }
    } catch (err) {
      setError(
        err.message || 'Logout failed. Please try again.'
      );
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <a href="/" className="navbar-brand">
        StayHealthy
      </a>

      <div className="navbar-links">
        <a href="/">Home</a>

        <a href="/#services">
          Appointments
        </a>

        {!user && (
          <>
            <a href="/#signup">Sign Up</a>
            <a href="/#login">Login</a>
          </>
        )}

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        )}
      </div>

      {error && <p role="alert">{error}</p>}
    </nav>
  );
}
