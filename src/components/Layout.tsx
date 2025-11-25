import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1><Link to="/">Content Publisher</Link></h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/public">Public</Link>
          {user ? (
            <>
              <Link to="/publications">My Publications</Link>
              <button onClick={() => { logout(); nav('/login') }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ marginTop: 20 }}>{children}</main>
    </div>
  )
}
