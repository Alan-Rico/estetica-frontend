import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas de ejemplo
function Dashboard() { return <h2>Bienvenido al Panel Principal</h2>; }
function Inventario() { return <h2>Gestión de Inventario</h2>; }
function Clientes() { return <h2>Gestión de Clientes</h2>; }


// Componente Layout con menú de navegación
function Layout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Barra lateral de navegación */}
      <aside style={{ width: '200px', backgroundColor: '#1e293b', color: '#fff', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Estética App</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/inventario" style={{ color: '#fff', textDecoration: 'none' }}>Inventario</Link>
          <Link to="/clientes" style={{ color: '#fff', textDecoration: 'none' }}>Clientes</Link>
        </nav>
        <button 
          onClick={handleLogout} 
          style={{ marginTop: '3rem', width: '100%', padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Contenido dinámico según la ruta */}
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f8fafc' }}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas por JWT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/citas" element={<Citas />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;