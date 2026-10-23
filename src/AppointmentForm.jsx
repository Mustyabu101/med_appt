import React, { useState } from 'react';

export default function AppointmentForm() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Appointment form submitted successfully!');
  };

  return (
    <section className="appointment-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Phone Number</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />

        <label>Date</label>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />

        <label>Time</label>
        <input name="time" type="time" value={form.time} onChange={handleChange} required />

        <button type="submit">Book Appointment</button>
      </form>
    </section>
  );
}
