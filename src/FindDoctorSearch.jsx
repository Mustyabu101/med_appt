import React, { useMemo, useState } from 'react';

const sampleDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'General Physician',
    availability: 'Available'
  },
  {
    id: 2,
    name: 'Dr. Michael Brown',
    specialty: 'Cardiologist',
    availability: 'Available'
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    specialty: 'Dermatologist',
    availability: 'Available'
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Pediatrician',
    availability: 'Available'
  }
];

export default function FindDoctorSearch({
  doctors = sampleDoctors,
  onSelectDoctor
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialty}`
        .toLowerCase()
        .includes(query)
    );
  }, [doctors, searchTerm]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSearchTerm(doctor.specialty);

    if (typeof onSelectDoctor === 'function') {
      onSelectDoctor(doctor);
    }
  };

  return (
    <section className="find-doctor-search">
      <h2>Find a Doctor</h2>
      <p>Search by doctor's name or medical specialty.</p>

      <label htmlFor="doctor-search">Doctor or specialty</label>
      <input
        id="doctor-search"
        type="search"
        placeholder="e.g. Sarah Johnson or Cardiology"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <div className="doctor-search-results" aria-live="polite">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <article className="doctor-result" key={doctor.id}>
              <h3>{doctor.name}</h3>
              <p>Specialty: {doctor.specialty}</p>
              <p>Status: {doctor.availability}</p>

              <button
                type="button"
                onClick={() => handleSelectDoctor(doctor)}
              >
                Select Doctor
              </button>
            </article>
          ))
        ) : (
          <p>No doctors found. Try another name or specialty.</p>
        )}
      </div>

      {selectedDoctor && (
        <p role="status">
          Selected: {selectedDoctor.name} — {selectedDoctor.specialty}
        </p>
      )}
    </section>
  );
}
