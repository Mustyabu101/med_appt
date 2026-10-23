import { useState } from 'react';

export default function DoctorCard({
  doctor = {
    name: 'Dr. Sarah Johnson',
    specialty: 'General Physician',
    appointmentDate: '2026-11-01',
    appointmentTime: '10:00'
  },
  onCancel
}) {
  const [cancelled, setCancelled] = useState(false);

  function handleCancelAppointment() {
    if (cancelled) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?'
    );

    if (!confirmed) return;

    try {
      const stored = JSON.parse(localStorage.getItem('appointments') || '[]');

      if (Array.isArray(stored)) {
        const remaining = stored.filter((appointment) => {
          if (doctor.id != null && appointment.id != null) {
            return String(appointment.id) !== String(doctor.id);
          }

          return !(
            appointment.name === doctor.name &&
            appointment.appointmentDate === doctor.appointmentDate &&
            appointment.appointmentTime === doctor.appointmentTime
          );
        });

        localStorage.setItem('appointments', JSON.stringify(remaining));
      }
    } catch (error) {
      console.error('Unable to update stored appointments:', error);
    }

    setCancelled(true);

    if (typeof onCancel === 'function') {
      onCancel(doctor);
    }
  }

  return (
    <article className="doctor-card">
      <h2>{doctor.name}</h2>
      <p>Specialty: {doctor.specialty}</p>
      <p>Date: {doctor.appointmentDate}</p>
      <p>Time: {doctor.appointmentTime}</p>

      {cancelled ? (
        <p role="status">Appointment cancelled.</p>
      ) : (
        <button type="button" onClick={handleCancelAppointment}>
          Cancel Appointment
        </button>
      )}
    </article>
  );
}
