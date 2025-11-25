import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const location = useLocation()

  const linkStyle = (path: string, isButton = false) => ({
    textDecoration: 'none',
    color: location.pathname === path ? (isButton ? 'white' : '#1890ff') : '#555',
    fontWeight: 500,
    padding: '6px 12px',
    borderRadius: 5,
    backgroundColor: location.pathname === path && isButton ? '#1890ff' : isButton ? '#1890ff' : 'transparent',
    transition: '0.3s',
  })

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '20px auto',
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #e0e0e0',
          paddingBottom: 10,
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            Content Publisher
          </Link>
        </h1>

        <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/public" style={linkStyle('/public')}>Public</Link>

          {user ? (
            <>
              <Link to="/publications" style={linkStyle('/publications')}>My Publications</Link>
              <button
                onClick={() => { logout(); nav('/login') }}
                style={linkStyle('/logout', true)}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle('/login')}>Login</Link>
              <Link to="/signup" style={linkStyle('/signup', true)}>Signup</Link>
            </>
          )}
        </nav>
      </header>

      <main
        style={{
          marginTop: 20,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
