import { useEffect, useMemo, useState } from 'react';

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

function getRoute() {
  return {
    isResults: window.location.pathname === '/search',
    specialty:
      new URLSearchParams(window.location.search).get('specialty') || ''
  };
}

export default function FindDoctorSearch({
  doctors = sampleDoctors,
  onSelectDoctor
}) {
  const [route, setRoute] = useState(getRoute);
  const [searchTerm, setSearchTerm] = useState(route.specialty);

  useEffect(() => {
    const syncRoute = () => {
      const next = getRoute();
      setRoute(next);
      setSearchTerm(next.specialty);
    };

    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = (
      route.isResults ? route.specialty : searchTerm
    ).trim().toLowerCase();

    if (!query) return doctors;

    return doctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialty}`
        .toLowerCase()
        .includes(query)
    );
  }, [doctors, route, searchTerm]);

  function navigate(url) {
    window.history.pushState({}, '', url);

    const next = getRoute();
    setRoute(next);
    setSearchTerm(next.specialty);

    requestAnimationFrame(() => {
      document
        .getElementById('doctor-search-view')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    });
  }

  function handleSelectDoctor(doctor) {
    navigate(
      `/search?specialty=${encodeURIComponent(doctor.specialty)}`
    );

    if (typeof onSelectDoctor === 'function') {
      onSelectDoctor(doctor);
    }
  }

  return (
    <section
      className="find-doctor-search"
      id="doctor-search-view"
    >
      {route.isResults ? (
        <>
          <h2>Search Results</h2>

          <p>
            {route.specialty
              ? `Doctors matching: ${route.specialty}`
              : 'Available sample doctors'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
          >
            Back to Doctor Search
          </button>
        </>
      ) : (
        <>
          <h2>Find a Doctor</h2>
          <p>
            Search by doctor's name or medical specialty.
          </p>

          <label htmlFor="doctor-search">
            Doctor or specialty
          </label>

          <input
            id="doctor-search"
            type="search"
            placeholder="Search doctors or specialties"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </>
      )}

      <div
        className="doctor-search-results"
        aria-live="polite"
      >
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <article
              className="doctor-result"
              key={doctor.id}
            >
              <h3>{doctor.name}</h3>
              <p>Specialty: {doctor.specialty}</p>
              <p>Status: {doctor.availability}</p>

              {!route.isResults && (
                <button
                  type="button"
                  onClick={() => handleSelectDoctor(doctor)}
                >
                  View {doctor.specialty} Results
                </button>
              )}
            </article>
          ))
        ) : (
          <p>
            No doctors found. Try another specialty.
          </p>
        )}
      </div>

      {route.isResults && (
        <p>
          These are demonstration doctor listings,
          not verified healthcare providers.
        </p>
      )}
    </section>
  );
}
