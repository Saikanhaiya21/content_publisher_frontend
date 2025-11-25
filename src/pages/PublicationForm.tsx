import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '../hooks/useForm'
import { publicationsApi } from '../api'
import { Loading } from '../components/Loading'
import { ErrorBanner } from '../components/ErrorBanner'
import type { PublicationStatus } from '../types'

export default function PublicationForm() {
  const { values, onChange } = useForm<{
    title: string
    content: string
    status: PublicationStatus
  }>({
    title: '',
    content: '',
    status: 'draft',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.title.trim()) return setError('Title is required')
    if (!values.content.trim()) return setError('Content is required')

    setLoading(true)
    try {
      await publicationsApi.create(values)
      nav('/publications')
    } catch (err: any) {
      setError(err.message || 'Failed to create publication')
    } finally {
      setLoading(false)
    }
  }

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
        New Publication
      </h2>

      <ErrorBanner message={error ?? undefined} />

      <form
        onSubmit={submit}
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
          placeholder="Enter a title"
          value={values.title}
          onChange={onChange('title')}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 15
          }}
        />

        <label style={{ fontWeight: 600 }}>Status</label>
        <select
          value={values.status}
          onChange={onChange('status')}
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
          placeholder="Write your content here..."
          value={values.content}
          onChange={onChange('content')}
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
          disabled={loading}
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
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? <Loading /> : "Create Publication"}
        </button>
      </form>
    </div>
  )
}
