import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { publicationsApi } from '../api'
import { Loading } from '../components/Loading'
import { ErrorBanner } from '../components/ErrorBanner'
import type { PublicationStatus } from '../types'

export default function PublicationEdit() {
  const { id } = useParams()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    if (id) load()
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const data = await publicationsApi.get(id!)
      setItem(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!item.title.trim()) return setError('Title is required')
    if (!item.content.trim()) return setError('Content is required')

    setSaving(true)
    try {
      await publicationsApi.update(id!, {
        title: item.title,
        content: item.content,
        status: item.status as PublicationStatus
      })
      nav('/publications')
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 20
        }}
      >
        Edit Publication
      </h2>

      <ErrorBanner message={error ?? undefined} />

      {item && (
        <form
          onSubmit={save}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 16,
            background: "#ffffff",
            padding: "24px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}
        >
          <label style={{ fontWeight: 600 }}>Title</label>
          <input
            value={item.title}
            onChange={e => setItem({ ...item, title: e.target.value })}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
            }}
          />

          <label style={{ fontWeight: 600 }}>Status</label>
          <select
            value={item.status}
            onChange={e => setItem({ ...item, status: e.target.value })}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
              background: "white",
            }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <label style={{ fontWeight: 600 }}>Content</label>
          <textarea
            value={item.content}
            onChange={e => setItem({ ...item, content: e.target.value })}
            rows={10}
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15,
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 8,
              padding: "12px 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              opacity: saving ? 0.6 : 1
            }}
          >
            {saving ? <Loading /> : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  )
}
