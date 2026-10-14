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
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">
            IF
          </div>

          <div>
            <p>IssueFlow</p>
            <span>Issue Management</span>
          </div>
        </div>

        <header className="login-header">
          <h1>Create account</h1>

          <p>
            Create an account to start using
            IssueFlow.
          </p>
        </header>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="login-field">
            <label
              htmlFor="register-confirm-password"
            >
              Confirm password
            </label>

            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="Enter password again"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Creating account...'
              : 'Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default RegisterPage