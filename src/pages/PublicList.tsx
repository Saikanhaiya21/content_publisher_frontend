import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { publicationsApi } from '../api'
import type { Publication } from '../types'
import { Loading } from '../components/Loading'
import { ErrorBanner } from '../components/ErrorBanner'

export default function PublicationsList() {
  const [items, setItems] = useState<Publication[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await publicationsApi.list()
      setItems(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string | number) {
    if (!confirm('Delete this publication?')) return
    try {
      await publicationsApi.remove(id)
      setItems(prev => prev ? prev.filter(p => p.id !== id) : prev)
    } catch (err: any) {
      alert(err.message || 'Failed to delete')
    }
  }

  async function toggleStatus(p: Publication) {
    const next = p.status === 'published' ? 'draft' : 'published'
    try {
      await publicationsApi.update(p.id, { status: next })
      setItems(prev =>
        prev ? prev.map(x => x.id === p.id ? { ...x, status: next } : x) : prev
      )
    } catch (err: any) {
      alert(err.message || 'Failed to update status')
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 20
        }}
      >
        My Publications
      </h2>

      <div style={{ marginBottom: 20 }}>
        <Link
          to="/publications/new"
          style={{
            display: 'inline-block',
            background: '#2563eb',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 8,
            textDecoration: 'none',
            fontSize: 15,
            fontWeight: 600,
            transition: '0.2s',
          }}
        >
          + New Publication
        </Link>
      </div>

      <ErrorBanner message={error ?? undefined} />

      {loading && (
        <div style={{ marginTop: 40 }}>
          <Loading />
        </div>
      )}

      {!loading && items && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            overflow: 'hidden',
            fontSize: 15
          }}
        >
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                Title
              </th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((p, index) => (
              <tr
                key={p.id}
                style={{
                  background: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}
              >
                <td style={{ padding: '12px 16px' }}>{p.title}</td>
                <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>
                  {p.status}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => toggleStatus(p)}
                      style={{
                        padding: '6px 12px',
                        background: p.status === 'published' ? '#d97706' : '#059669',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      onClick={() => nav(`/publications/${p.id}/edit`)}
                      style={{
                        padding: '6px 12px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => remove(p.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
