function Landing() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#800020', fontSize: '2.5rem', margin: 0 }}>ENTRENAPP</h1>
      <p style={{ color: '#555', margin: '0.75rem 0 2rem' }}>
        Entrená como querés, donde querés.
      </p>
      <button
        style={{
          backgroundColor: '#800020',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.9rem 2rem',
          fontSize: '1.1rem',
        }}
      >
        COMENZAR
      </button>
    </div>
  )
}

export default Landing
