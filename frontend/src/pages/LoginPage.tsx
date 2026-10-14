import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api/http'

import './AuthPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError(null)

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Email and password are required')
      return
    }

    try {
      setIsSubmitting(true)

      await signIn({
        email: trimmedEmail,
        password,
      })

      navigate('/')
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        setError('Invalid email or password')
      } else if (
        error instanceof ApiError &&
        error.status === 400
      ) {
        setError('Please enter a valid email and password')
      } else {
        setError('Unable to sign in. Please try again.')
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
          <h1>Sign in</h1>

          <p>
            Sign in to continue to IssueFlow.
          </p>
        </header>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
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
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
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
              ? 'Signing in...'
              : 'Sign In'}
          </button>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage