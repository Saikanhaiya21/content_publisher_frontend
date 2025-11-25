import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api'
import type { User } from '../types'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')

    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [user, token])

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      // expect { token, user }
      setToken(data.token)
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }

  async function signup(email: string, password: string) {
    setLoading(true)
    try {
      const data = await authApi.signup(email, password)
      setToken(data.token)
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
