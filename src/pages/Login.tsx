import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Credenciales incorrectas');

      const data = await response.json();
      localStorage.setItem('token', data.jwt);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' }}>Iniciar Sesión</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <div style={styles.group}>
          <label style={styles.label}>Usuario</label>
          <input 
            type="text" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={styles.input}
            placeholder="Usuario"
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Contraseña</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' },
  card: { backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '320px' },
  group: { marginBottom: '1rem', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' },
  
  input: { 
    padding: '8px 12px', 
    border: '1px solid #d1d5db', 
    borderRadius: '4px', 
    outline: 'none', 
    fontSize: '0.95rem',
    minHeight: '48px' // <--- Accesibilidad táctil
  },
  
  button: { 
    padding: '10px', 
    backgroundColor: '#4f46e5', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    width: '100%', 
    marginTop: '0.5rem',
    minHeight: '48px' // <--- Accesibilidad táctil
  },
  
  error: { color: 'red', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }
};
