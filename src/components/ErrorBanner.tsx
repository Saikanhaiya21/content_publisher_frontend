export const ErrorBanner: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null
  return (
    <div style={{ background: '#ffe6e6', color: '#900', padding: 10, borderRadius: 6 }}>
      {message}
    </div>
  )
}
