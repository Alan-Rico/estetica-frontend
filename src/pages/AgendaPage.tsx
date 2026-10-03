import { useState, useEffect, CSSProperties, FormEvent } from 'react';

interface Cita {
  id?: number;
  nombreCliente: string;
  telefonoContacto: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado?: string;
}

export const AgendaPage = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorForm, setErrorForm] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [servicio, setServicio] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const token = localStorage.getItem('token');

  const cargarCitas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/citas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCitas(data);
      }
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleAgendar = async (e: FormEvent) => {
    e.preventDefault();
    setErrorForm('');
    setExitoMsg('');

    const nuevaCita: Cita = {
      nombreCliente,
      telefonoContacto,
      servicio,
      fecha,
      hora
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevaCita)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al agendar la cita');
      }

      setExitoMsg('¡Cita agendada correctamente!');
      setNombreCliente('');
      setTelefonoContacto('');
      setServicio('');
      setFecha('');
      setHora('');
      cargarCitas();
    } catch (err: any) {
      setErrorForm(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Agenda de la Estética</h1>
      </header>

      {/* Formulario de Registro */}
      <section style={styles.card}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Agendar Nueva Cita</h2>
        
        {errorForm && <p style={styles.error}>{errorForm}</p>}
        {exitoMsg && <p style={styles.exito}>{exitoMsg}</p>}

        <form onSubmit={handleAgendar} style={styles.formGrid}>
          <div>
            <label style={styles.label}>Cliente</label>
            <input
              type="text"
              required
              placeholder="Nombre del cliente"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Teléfono</label>
            <input
              type="tel"
              required
              placeholder="Ej. 5512345678"
              value={telefonoContacto}
              onChange={(e) => setTelefonoContacto(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Servicio</label>
            <input
              type="text"
              required
              placeholder="Ej. Corte de cabello, Tinte"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Fecha</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Hora</label>
            <input
              type="time"
              required
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.buttonPrimary}>
            Guardar Cita
          </button>
        </form>
      </section>

      {/* Listado de Agenda */}
      <section style={styles.card}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Citas Agendadas</h2>
        {loading ? (
          <p>Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No hay citas registradas.</p>
        ) : (
          <div style={styles.list}>
            {citas.map((cita) => (
              <div key={cita.id} style={styles.citaCard}>
                <div>
                  <strong>{cita.hora}</strong> - {cita.nombreCliente}
                  <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    {cita.servicio} | 📅 {cita.fecha} | 📞 {cita.telefonoContacto}
                  </div>
                </div>
                <span style={styles.badge}>{cita.estado || 'PENDIENTE'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: { padding: '16px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' },
  header: { marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #e5e7eb' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' },
  formGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '4px', color: '#374151' },
  input: { width: '100%', minHeight: '48px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' },
  buttonPrimary: { minHeight: '48px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' },
  exito: { backgroundColor: '#d1fae5', color: '#059669', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  citaCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', border: '1px solid #f3f4f6', backgroundColor: '#f9fafb' },
  badge: { backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }
};