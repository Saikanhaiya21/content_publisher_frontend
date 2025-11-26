import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PublicationsList from './pages/PublicationsList'
import PublicationForm from './pages/PublicationForm'
import PublicationEdit from './pages/PublicationEdit'
import PublicList from './pages/PublicList'
import { useAuth } from './context/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/public" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/public" element={<PublicList />} />

        <Route path="/publications" element={
          <PrivateRoute>
            <PublicationsList />
          </PrivateRoute>
        } />

        <Route path="/publications/new" element={
          <PrivateRoute>
            <PublicationForm />
          </PrivateRoute>
        } />

        <Route path="/publications/:id/edit" element={
          <PrivateRoute>
            <PublicationEdit />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  )
}
