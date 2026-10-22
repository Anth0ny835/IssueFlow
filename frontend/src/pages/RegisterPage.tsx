import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { register } from '../api/auth'
import { ApiError } from '../api/http'

import './AuthPage.css'

function RegisterPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError(null)

    const trimmedEmail = email.trim()

    if (
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters',
      )
      return
    }

    try {
      setIsSubmitting(true)

      await register({
        email: trimmedEmail,
        password,
      })

      navigate('/login')
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 409
      ) {
        setError(
          'An account with this email already exists',
        )
      } else if (
        error instanceof ApiError &&
        error.status === 400
      ) {
        setError(
          'Please enter a valid email and password',
        )
      } else {
        setError(
          'Unable to create account. Please try again.',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-intro">
          <div className="auth-brand">
            <div className="auth-brand-mark">IF</div>

            <div>
              <strong>IssueFlow</strong>
              <span>Issue Management</span>
            </div>
          </div>

          <div className="auth-intro-content">
            <p className="auth-eyebrow">ISSUEFLOW</p>

            <h1>Bring projects and issues into one workspace.</h1>

            <p>
              Create an account to manage projects, track issue
              progress, and keep development work organised.
            </p>
          </div>

          <p className="auth-intro-footer">
            Software issue &amp; release management
          </p>
        </div>

        <div className="auth-form-side">
          <section className="auth-card">
            <div className="auth-card-header">
              <p className="auth-eyebrow">GET STARTED</p>

              <h2>Create your account</h2>

              <p>
                Set up your IssueFlow workspace in a few seconds.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="auth-field">
                <label htmlFor="register-email">
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />
              </div>

              <div className="auth-field">
                <label htmlFor="register-confirm-password">
                  Confirm Password
                </label>

                <input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                />
              </div>

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <button
                className="auth-primary-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link to="/login">
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage