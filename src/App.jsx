import { useState } from 'react'
import './App.css'

const API_BASE =
  (import.meta.env.VITE_API_URL || 'https://dhiyogram-backend.onrender.com').replace(/\/$/, '')

function App() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const canLogIn = identifier.trim().length > 0 && password.length > 0

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Logging in…' })
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: identifier, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`)
      }
      setStatus({ type: 'success', message: `Welcome, ${data?.user?.usernameOrEmail || identifier}!` })
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Login failed' })
    }
  }

  return (
    <main className="auth">
      <div className="auth__grid">
        <section className="phone" aria-hidden="true">
          <div className="phone__frame">
            <div className="phone__screen">
              <div className="phone__shot phone__shot--a" />
              <div className="phone__shot phone__shot--b" />
            </div>
          </div>
        </section>

        <section className="panels" aria-label="Log in">
          <div className="card">
            <div className="brand" aria-label="Dhiyogram">
              Dhiyogram
            </div>

            <form className="form" onSubmit={onSubmit}>
              <label className="field">
                <span className="field__label">Phone number, username, or email</span>
                <input
                  className="field__input"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </label>

              <label className="field">
                <span className="field__label">Password</span>
                <div className="field__row">
                  <input
                    className="field__input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="field__toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <button className="primary" type="submit" disabled={!canLogIn}>
                {status.type === 'loading' ? 'Please wait…' : 'Log in'}
              </button>

              {status.type !== 'idle' && (
                <p
                  className={`status ${
                    status.type === 'success' ? 'status--success' : status.type === 'error' ? 'status--error' : ''
                  }`}
                  role={status.type === 'error' ? 'alert' : 'status'}
                >
                  {status.message}
                </p>
              )}

              <div className="divider" role="separator" aria-label="or">
                <span />
                <p>OR</p>
                <span />
              </div>

              <button type="button" className="alt">
                Log in with Dhiyo
              </button>

              <a className="mutedLink" href="#">
                Forgot password?
              </a>
            </form>
          </div>

          <div className="card card--thin">
            <p className="small">
              Don&apos;t have an account?{' '}
              <a href="#" className="disabledLink" aria-disabled="true" onClick={(e) => e.preventDefault()}>
                Sign up
              </a>
            </p>
          </div>

          <footer className="footer">
            <nav className="footer__links" aria-label="Footer links">
              <a href="#">About</a>
              <a href="#">Help</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Locations</a>
              <a href="#">Language</a>
            </nav>
            <div className="footer__meta">© {new Date().getFullYear()} Dhiyogram</div>
          </footer>
        </section>
      </div>
    </main>
  )
}

export default App
