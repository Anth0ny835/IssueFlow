import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import { useAuth } from './AuthContext'

function ProtectedRoute() {
  const {
    user,
    isLoading,
  } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-loading">
        Checking your session...
      </main>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute