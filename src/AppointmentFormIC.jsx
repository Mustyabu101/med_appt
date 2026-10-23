import { useState } from 'react';

export default function AppointmentFormIC() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    alert('Instant consultation form submitted.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="ic-name">Name</label>
      <input
        id="ic-name"
        name="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="ic-phone">Phone Number</label>
      <input
        id="ic-phone"
        name="phone"
        type="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        required
      />

      <button type="submit">Request Consultation</button>
    </form>
  );
}
