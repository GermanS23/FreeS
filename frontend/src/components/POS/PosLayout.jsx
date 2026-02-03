export default function PosLayout({ children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 3fr 1fr',
        height: '100vh',
        gap: '12px',
        padding: '12px',
      }}
    >
      {children}
    </div>
  )
}
