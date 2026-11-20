import { useEffect, useState } from 'react';

const doctors = [
  'Dr. Sarah Johnson',
  'Dr. Michael Brown',
  'Dr. Emily Davis',
  'Dr. James Wilson',
];

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadAppointments() {
    const response = await fetch('/api/appointments', {
      credentials: 'same-origin',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to load requests.');
    }

    setAppointments(data.appointments || []);
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch('/api/appointments', {
          credentials: 'same-origin',
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load requests.');
        }

        if (active) setAppointments(data.appointments || []);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function handleBook(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed.');
      }

      form.reset();
      await loadAppointments();

      setMessage(
        'Your appointment request was saved. ' +
        'This is a demonstration, not a confirmed medical booking.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this appointment request?')) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        `/api/appointments?id=${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cancellation failed.');
      }

      await loadAppointments();
      setMessage('Appointment request cancelled.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const fieldStyle = {
    display: 'block',
    width: '100%',
    padding: '12px',
    marginTop: '6px',
    marginBottom: '16px',
    border: '1px solid #bbb',
    borderRadius: '8px',
  };

  return (
    <section
      className="patient-appointments"
      style={{ margin: '32px 0' }}
    >
      <h2>Appointment Requests</h2>
      <p>
        Submit a demonstration appointment request and
        manage your saved requests.
      </p>

      <form
        onSubmit={handleBook}
        style={{ maxWidth: '560px', marginTop: '24px' }}
      >
        <label htmlFor="booking-doctor">Doctor</label>
        <select
          id="booking-doctor"
          name="doctorName"
          required
          defaultValue=""
          style={fieldStyle}
        >
          <option value="" disabled>Select a sample doctor</option>
          {doctors.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <label htmlFor="booking-phone">Phone number</label>
        <input
          id="booking-phone"
          name="phone"
          type="tel"
          required
          minLength={7}
          maxLength={30}
          style={fieldStyle}
        />

        <label htmlFor="booking-date">Preferred date</label>
        <input
          id="booking-date"
          name="date"
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          required
          style={fieldStyle}
        />

        <label htmlFor="booking-time">Preferred time</label>
        <input
          id="booking-time"
          name="time"
          type="time"
          required
          style={fieldStyle}
        />

        <button
          type="submit"
          className="signup-submit"
          disabled={busy}
        >
          {busy ? 'Saving...' : 'Submit Request'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <h3 style={{ marginTop: '32px' }}>My Saved Requests</h3>

      {loading ? (
        <p>Loading appointment requests...</p>
      ) : appointments.length === 0 ? (
        <p>You have no saved appointment requests.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="feature-card"
            >
              <h4>{appointment.doctor_name}</h4>
              <p>{appointment.specialty}</p>
              <p>
                Date: {String(appointment.appointment_date).slice(0, 10)}
              </p>
              <p>
                Time: {String(appointment.appointment_time).slice(0, 5)}
              </p>
              <p>Status: {appointment.status}</p>
              <button
                type="button"
                className="feature-link"
                disabled={busy}
                onClick={() => handleCancel(appointment.id)}
              >
                Cancel Request
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
