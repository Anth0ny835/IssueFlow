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

            <h1>Manage software issues with clarity.</h1>

            <p>
              Track projects, organise issues, and keep work moving
              through a simple release-management workflow.
            </p>
          </div>

          <p className="auth-intro-footer">
            Software issue &amp; release management
          </p>
        </div>

        <div className="auth-form-side">
          <section className="auth-card">
            <div className="auth-card-header">
              <p className="auth-eyebrow">WELCOME BACK</p>

              <h2>Sign in to IssueFlow</h2>

              <p>
                Enter your account details to continue.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="auth-field">
                <label htmlFor="login-email">
                  Email
                </label>

                <input
                  id="login-email"
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
                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
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
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="auth-switch">
              New to IssueFlow?{" "}
              <Link to="/register">
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default LoginPage