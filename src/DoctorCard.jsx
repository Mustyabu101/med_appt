import React, { useState } from 'react';

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

  const handleCancelAppointment = () => {
    if (cancelled) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this appointment?'
    );

    if (!confirmed) return;

    setCancelled(true);

    if (typeof onCancel === 'function') {
      onCancel(doctor);
    }
  };

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
