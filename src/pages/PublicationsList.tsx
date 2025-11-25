import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { publicationsApi } from '../api'
import type { Publication } from '../types'
import { Loading } from '../components/Loading'
import { ErrorBanner } from '../components/ErrorBanner'

export default function PublicationsList() {
  const [items, setItems] = useState<Publication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [selected, setSelected] = useState<(string | number)[]>([])
  const [showDeleted, setShowDeleted] = useState(false)

  const nav = useNavigate()

  useEffect(() => {
    load()
  }, [search, statusFilter, showDeleted])

  async function load() {
    setLoading(true)
    setError(null)

    try {
      let data

      if (showDeleted) {
        data = await publicationsApi.listDeleted()
      } else {
        const params: Record<string, any> = {}
        if (search.trim()) params.title = search.trim()
        if (statusFilter) params.status = statusFilter
        data = await publicationsApi.list(params)
      }

      if (!Array.isArray(data)) throw new Error("Data Not Found")

      setItems(data)
      setSelected([])
    } catch (err: any) {
      setError(err.message || 'Failed to load')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function bulkDelete() {
    if (selected.length === 0) return alert("Select items first")

    if (!confirm(`Delete ${selected.length} publications?`)) return

    try {
      await publicationsApi.bulkDelete(selected)
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function undoBulk() {
    if (selected.length === 0) return alert("Select items first")

    try {
      await publicationsApi.undoDelete(selected)
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  function toggleSelect(id: number | string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function selectAll() {
    if (selected.length === items.length) {
      setSelected([])
    } else {
      setSelected(items.map(i => i.id))
    }
  }

  async function remove(id: string | number) {
    if (!confirm('Delete this publication?')) return

    try {
      await publicationsApi.remove(id)
      setItems(prev => prev.filter(p => p.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete')
    }
  }

  async function toggleStatus(p: Publication) {
    const next = p.status === 'published' ? 'draft' : 'published'

    try {
      await publicationsApi.update(p.id, { status: next })
      setItems(prev =>
        prev.map(x => (x.id === p.id ? { ...x, status: next } : x))
      )
    } catch (err: any) {
      alert(err.message || 'Failed to update status')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>
        {showDeleted ? "Deleted Publications" : "My Publications"}
      </h2>

      {/* Top Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        {!showDeleted && (
          <Link
            to="/publications/new"
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 600
            }}
          >
            + New Publication
          </Link>
        )}

        {/* Search */}
        {!showDeleted && (
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15
            }}
          />
        )}

        {/* Filter */}
        {!showDeleted && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 15
            }}
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        )}

        {/* View Deleted Toggle */}
        <button
          onClick={() => setShowDeleted(!showDeleted)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "#374151",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          {showDeleted ? "Back to List" : "View Deleted"}
        </button>
      </div>

      {/* Bulk Delete / Undo Buttons */}
      {selected.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {showDeleted ? (
            <button
              onClick={undoBulk}
              style={{ padding: "8px 16px", background: "#059669", color: "#fff", borderRadius: 6, border: "none" }}
            >
              Restore Selected ({selected.length})
            </button>
          ) : (
            <button
              onClick={bulkDelete}
              style={{ padding: "8px 16px", background: "#dc2626", color: "#fff", borderRadius: 6, border: "none" }}
            >
              Delete Selected ({selected.length})
            </button>
          )}
        </div>
      )}

      <ErrorBanner message={error ?? undefined} />
      {loading && <Loading />}

      {!loading && items.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, border: "1px solid #e5e7eb", borderRadius: 12 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px 16px" }}>
                <input
                  type="checkbox"
                  checked={selected.length === items.length}
                  onChange={selectAll}
                />
              </th>
              <th style={{ padding: "12px 16px" }}>Title</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p, idx) => (
              <tr key={p.id} style={{ background: idx % 2 ? "#f9fafb" : "#fff" }}>
                <td style={{ padding: "12px 16px" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>

                <td style={{ padding: "12px 16px" }}>{p.title}</td>

                <td style={{ padding: "12px 16px" }}>
                  {showDeleted ? "Deleted" : p.status}
                </td>

                <td style={{ padding: "12px 16px" }}>
                  {!showDeleted ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => toggleStatus(p)}
                        style={{
                          padding: "6px 12px",
                          background: p.status === "published" ? "#d97706" : "#059669",
                          color: "#fff",
                          borderRadius: 6,
                          border: "none"
                        }}
                      >
                        {p.status === "published" ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => nav(`/publications/${p.id}/edit`)}
                        style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", borderRadius: 6, border: "none" }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => remove(p.id)}
                        style={{ padding: "6px 12px", background: "#dc2626", color: "#fff", borderRadius: 6, border: "none" }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <i style={{ color: "#6b7280" }}>Deleted</i>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
