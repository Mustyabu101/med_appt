import { useState } from 'react';

export default function ProfileCard() {
  const [name, setName] = useState('Alex Johnson');
  const [role, setRole] = useState('Healthcare Professional');
  const [email, setEmail] = useState('alex@example.com');
  const [editing, setEditing] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
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
          {name.charAt(0).toUpperCase()}
        </div>

        {!editing && (
          <>
            <h2>{name}</h2>
            <p>{role}</p>
            <p>{email}</p>
            <button type="button" onClick={() => setEditing(true)}>
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
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="profile-role">Role</label>
          <input
            id="profile-role"
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            required
          />

          <label htmlFor="profile-email">Email Address</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </section>
  );
}
