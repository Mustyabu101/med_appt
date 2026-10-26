
import { useState } from 'react'
import FindDoctorSearch from './FindDoctorSearch'
import './App.css'
import Notification from './Notification'

export default function App() {
  const [notice, setNotice] = useState('')
  const [registering, setRegistering] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  const features = [
    {
      icon: '📅',
      title: 'Appointments',
      text: 'Keep track of your upcoming visits.',
      action: 'View appointments',
    },
    {
      icon: '💊',
      title: 'Medications',
      text: 'Keep your medication routine organised.',
      action: 'Manage medications',
    },
    {
      icon: '❤️',
      title: 'Wellness',
      text: 'Make time for your everyday wellbeing.',
      action: 'Explore wellness',
    },
  ]

  async function handleRegister(e) {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setNotice('Your passwords do not match.')
      return
    }

    if (password.length < 8) {
      setNotice('Your password must contain at least 8 characters.')
      return
    }

    setRegistering(true)
    setNotice('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          role: formData.get('role'),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.')
      }

      setNotice(
        'Registration successful! You can now log in with your email and password.'
      )

      form.reset()
      document.getElementById('login')?.scrollIntoView({
        behavior: 'smooth',
      })
    } catch (error) {
      setNotice(
        error.message ||
          'Unable to register. Please check your connection and try again.'
      )
    } finally {
      setRegistering(false)
    }
  }

  async function handleLogin(e) {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    setLoggingIn(true)
    setNotice('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.')
      }

      if (!data.user) {
        throw new Error('Login response did not include user information.')
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)

      setNotice(
        `Welcome back, ${data.user.name || 'user'}! Login successful.`
      )

      form.reset()
    } catch (error) {
      setNotice(
        error.message ||
          'Unable to log in. Please check your details and try again.'
      )
    } finally {
      setLoggingIn(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    sessionStorage.clear()
    setUser(null)
    setNotice('You have been logged out successfully.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          aria-label="StayHealthy home"
        >
          <span className="brand-icon">✚</span>
          <span>
            Stay<span className="brand-accent">Healthy</span>
          </span>
        </a>

        <nav className="nav-links">
          <a className="active-link" href="#services">
            Appointments
          </a>
          <a href="#login">Login</a>
        </nav>

        {!user && (
          <button
            className="header-button"
            type="button"
            onClick={() =>
              document.getElementById('signup')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            Sign Up <span>↗</span>
          </button>
        )}

        {user && (
          <button
            className="header-button logout-button"
            type="button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        )}
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot"></span>
              YOUR WELLNESS, YOUR WAY
            </div>

            <h1>
              A healthier you
              <br />
              starts <span>right here.</span>
            </h1>

            <p className="hero-description">
              Take charge of your wellbeing with a simpler way to
              organise appointments, build healthy habits, and put
              your health first.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() =>
                  document.getElementById('signup')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }
              >
                Get started <span>→</span>
              </button>

              <a className="text-link" href="#services">
                Explore features <span>↓</span>
              </a>
            </div>

            <div className="trust-line">
              <span className="trust-icon">✓</span>
              A little progress every day makes a difference.
            </div>
          </div>

          <div className="hero-art" aria-label="Wellness illustration">
            <div className="art-orbit orbit-one"></div>
            <div className="art-orbit orbit-two"></div>
            <div className="sun-shape"></div>

            <div className="plant plant-left">
              <i></i><i></i><i></i><i></i><b></b>
            </div>

            <div className="plant plant-right">
              <i></i><i></i><i></i><i></i><b></b>
            </div>

            <div className="health-card">
              <div className="heart-symbol">♥</div>
              <div className="health-label">YOUR HEALTH MATTERS</div>
              <h2>
                Feel good.
                <br />
                <span>Live well.</span>
              </h2>
              <p>Small steps. Lasting habits.</p>
              <div className="mini-progress">
                <span></span>
              </div>
              <div className="progress-caption">
                <span>Daily wellbeing</span>
                <strong>One day at a time</strong>
              </div>
            </div>

            <div className="floating-note">
              <span>✦</span> Make yourself a priority
            </div>
          </div>
        </section>

        <section className="welcome-strip" id="about">
          <div className="welcome-mark">✚</div>
          <div>
            <h2>Your health journey, made simpler.</h2>
            <p>
              One welcoming place to focus on the things that help
              you feel your best.
            </p>
          </div>
          <span className="strip-decoration">✳</span>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <div>
              <div className="eyebrow">MADE FOR YOUR EVERYDAY</div>
              <h2>Care for what matters.</h2>
            </div>

            <p>
              Simple tools to help you stay organised
              <br />
              and put your wellbeing first.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <button
                  className="feature-link"
                  onClick={() =>
                    setNotice(
                      `${feature.title} functionality is not connected yet.`
                    )
                  }
                >
                  {feature.action} <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        <FindDoctorSearch
          onSelectDoctor={(doctor) => {
            const specialty = doctor.specialty
            const params = new URLSearchParams(window.location.search)
            params.set('specialty', specialty)
            window.history.pushState(
              {},
              '',
              `${window.location.pathname}?${params.toString()}`
            )
            setNotice(`Showing doctors for ${specialty}.`)
          }}
        />

        <section className="signup-section" id="signup">
          <div className="signup-intro">
            <div className="eyebrow">YOUR JOURNEY STARTS HERE</div>

            <h2>
              Create your <span>StayHealthy</span> account.
            </h2>

            <p>
              Join us and make managing your healthcare a little
              simpler.
            </p>

            <div className="signup-benefit">
              <span>✓</span> Keep your healthcare organised
            </div>
            <div className="signup-benefit">
              <span>✓</span> Stay connected with your care team
            </div>
            <div className="signup-benefit">
              <span>✓</span> Put your wellbeing first
            </div>
          </div>

          <form className="signup-form" onSubmit={handleRegister}>
            <div className="form-heading">
              <div className="form-symbol">✚</div>
              <h3>Create an account</h3>
              <p>Enter your details to get started.</p>
            </div>

            <label htmlFor="signup-role">Role</label>
            <select
              id="signup-role"
              name="role"
              defaultValue="Patient"
              required
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Healthcare Professional">
                Healthcare Professional
              </option>
            </select>

            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

            <div className="form-row">
              <div>
                <label htmlFor="signup-email">Email Address</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-phone">Phone Number</label>
                <input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-confirm">
                  Confirm Password
                </label>
                <input
                  id="signup-confirm"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <label className="terms-check">
              <input type="checkbox" required />
              <span>
                I agree to the terms of service and privacy policy.
              </span>
            </label>

            <button
              className="signup-submit"
              type="submit"
              disabled={registering}
            >
              {registering ? 'Creating account...' : 'Create Account'}
              {!registering && <span>→</span>}
            </button>

            <p className="form-footnote">
              Already have an account?{' '}
              <a href="#login">Log in</a>
            </p>
          </form>
        </section>

        <Notification
          message={notice}
          onDismiss={() => setNotice('')}
        />
      </main>

      <section className="login-section" id="login">
        <div className="login-card">
          <div className="form-symbol">✚</div>
          <div className="eyebrow login-eyebrow">WELCOME BACK</div>
          <h2>Welcome back!</h2>
          <p className="login-subtitle">
            Log in to continue your health journey.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault()
                  setNotice(
                    'Password recovery is not connected yet.'
                  )
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              className="signup-submit"
              type="submit"
              disabled={loggingIn}
            >
              {loggingIn ? 'Logging in...' : 'Log In'}
              {!loggingIn && <span>→</span>}
            </button>

            <p className="form-footnote">
              New to StayHealthy? <a href="#signup">Create an account</a>
            </p>
          </form>
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">✚</span>
          <span>
            Stay<span className="brand-accent">Healthy</span>
          </span>
        </a>

        <p>Made with care for a healthier tomorrow.</p>

        <span>© {new Date().getFullYear()} StayHealthy</span>
      </footer>
    </div>
  )
}
