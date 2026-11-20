import { useState } from 'react';

export default function AppointmentForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (typeof onSubmit !== 'function') {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      date: form.date,
      time: form.time
    });
  };

  return (
    <section className="appointment-form">
      <h2>Book an Appointment</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="appointment-name">Name</label>
        <input
          id="appointment-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="appointment-phone">Phone Number</label>
        <input
          id="appointment-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="appointment-date">Date</label>
        <input
          id="appointment-date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <label htmlFor="appointment-time">Time</label>
        <input
          id="appointment-time"
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Book Appointment
        </button>
      </form>
    </section>
  );
}
