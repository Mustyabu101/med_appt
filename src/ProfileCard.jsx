import { useState } from 'react';

const defaultProfile = {
  name: 'Alex Johnson',
  role: 'Healthcare Professional',
  email: 'alex@example.com',
  phone: ''
};

function loadProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem('stayhealthy_profile') || 'null');
    return saved && typeof saved === 'object'
      ? { ...defaultProfile, ...saved }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export default function ProfileCard() {
  const [profile, setProfile] = useState(loadProfile);
  const [form, setForm] = useState(profile);
  const [editing, setEditing] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    try {
      localStorage.setItem('stayhealthy_profile', JSON.stringify(form));
      setProfile(form);
      setEditing(false);
    } catch (error) {
      console.error('Unable to save profile:', error);
    }
  }

  function handleCancel() {
    setForm(profile);
    setEditing(false);
  }

  return (
    <section className="profile-card">
      <div className="profile-card-header">
        <div
          className="profile-avatar"
          aria-hidden="true"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#dbeafe',
            color: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '16px'
          }}
        >
          {profile.name.charAt(0).toUpperCase()}
        </div>

        {!editing && (
          <>
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
            <p>{profile.email}</p>
            <p>Phone: {profile.phone || 'Not provided'}</p>
            <button
              type="button"
              onClick={() => {
                setForm(profile);
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit}>
          <h3>Edit Your Profile</h3>

          <label htmlFor="profile-name">Full Name</label>
          <input
            id="profile-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="profile-role">Role</label>
          <input
            id="profile-role"
            name="role"
            type="text"
            value={form.role}
            onChange={handleChange}
            required
          />

          <label htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="profile-phone">Phone Number</label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}
    </section>
  );
}
