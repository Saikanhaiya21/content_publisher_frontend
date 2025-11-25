import { useEffect, useState } from "react"
import { publicationsApi } from "../api"
import type { Publication } from "../types"
import { Loading } from "../components/Loading"
import { ErrorBanner } from "../components/ErrorBanner"

export default function PublicationsList() {
  const [items, setItems] = useState<Publication[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data = await publicationsApi.publicList()

      if (!Array.isArray(data)) {
        throw new Error("Data not found")
      }

      setItems(data)
    } catch (err: any) {
      setError(err.message || "Failed to load")
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        Publications
      </h2>

      <ErrorBanner message={error ?? undefined} />

      {loading && (
        <div style={{ marginTop: 40 }}>
          <Loading />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <p style={{ marginTop: 20, color: "#6b7280" }}>
          No public publications found.
        </p>
      )}

      {/* ==== CARD LAYOUT ==== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {items.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {p.title}
            </h3>

            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
                marginBottom: 12,
                textTransform: "capitalize",
              }}
            >
              Status: {p.status}
            </p>

            <p
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 1.5,
                maxHeight: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
              }}
            >
              {p.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
