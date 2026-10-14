import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { ReactNode } from 'react'

import {
  getCurrentUser,
  login,
  logout,
} from '../api/auth'

import { ApiError } from '../api/http'

import type {
  AuthUser,
  LoginRequest,
} from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean

  signIn: (
    request: LoginRequest,
  ) => Promise<void>

  signOut: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  )

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const currentUser =
          await getCurrentUser()

        setUser(currentUser)
      } catch (error) {
        if (
          error instanceof ApiError &&
          error.status === 401
        ) {
          setUser(null)
        } else {
          setUser(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadCurrentUser()
  }, [])

  async function signIn(
    request: LoginRequest,
  ) {
    const authenticatedUser =
      await login(request)

    setUser(authenticatedUser)
  }

  async function signOut() {
    await logout()

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    )
  }

  return context
}