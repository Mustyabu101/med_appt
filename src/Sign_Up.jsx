import React, { useState } from 'react';

export default function Sign_Up() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Patient'
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Registration failed.');
      }

      setMessage(result.message || 'Registration successful!');
      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'Patient'
      });
    } catch (error) {
      setMessage(error.message || 'Unable to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-form">
      <h2>Create Your StayHealthy Account</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="signup-name">Full Name</label>
        <input
          id="signup-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="signup-email">Email Address</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          minLength={8}
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="signup-phone">Phone Number</label>
        <input
          id="signup-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="signup-role">Account Type</label>
        <select
          id="signup-role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>

        {message && <p role="status">{message}</p>}
      </form>
    </section>
  );
}
