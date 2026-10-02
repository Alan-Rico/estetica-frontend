import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Plus, Phone, MessageSquare } from 'lucide-react';

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formulario nueva cita
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [servicio, setServicio] = useState('');
  const [fechaHoraInicio, setFechaHoraInicio] = useState('');
  const [fechaHoraFin, setFechaHoraFin] = useState('');

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchCitas = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/citas', getAuthHeaders());
      setCitas(res.data);
    } catch (err) {
      console.error('Error cargando citas', err);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const handleAgendar = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:8080/api/v1/citas',
        {
          clienteNombre,
          clienteTelefono,
          servicio,
          fechaHoraInicio,
          fechaHoraFin
        },
        getAuthHeaders()
      );

      // Limpiar formulario
      setClienteNombre('');
      setClienteTelefono('');
      setServicio('');
      setFechaHoraInicio('');
      setFechaHoraFin('');
      fetchCitas();
    } catch (err) {
      setError(err.response?.data || 'Error al agendar cita');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir WhatsApp con mensaje prellenado
  const enviarRecordatorioWhatsApp = (cita) => {
    // Formatear teléfono quitando espacios o guiones
    const telLimpio = cita.clienteTelefono.replace(/\D/g, '');
    
    // Formatear fecha y hora para lectura humana
    const fecha = new Date(cita.fechaHoraInicio).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const hora = new Date(cita.fechaHoraInicio).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const mensaje = `Hola ${cita.clienteNombre}, te recordamos tu cita en la Estética para *${cita.servicio}* el día *${fecha}* a las *${hora}*. ¡Te esperamos! ✨`;
    const urlWA = `https://wa.me/521${telLimpio}?text=${encodeURIComponent(mensaje)}`;

    window.open(urlWA, '_blank');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-pink-600">
        <Calendar size={28} /> Agenda de Citas
      </h1>

      {/* Formulario de Agendamiento */}
      <form onSubmit={handleAgendar} className="bg-white p-6 rounded-xl shadow-md border mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="col-span-full font-semibold text-lg flex items-center gap-2">
          <Plus size={20} /> Agendar Nueva Cita
        </h2>

        {error && <p className="col-span-full text-red-500 bg-red-50 p-2 rounded text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Nombre del Cliente"
          required
          className="border p-3 rounded-lg w-full"
          value={clienteNombre}
          onChange={(e) => setClienteNombre(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Teléfono (10 dígitos)"
          required
          className="border p-3 rounded-lg w-full"
          value={clienteTelefono}
          onChange={(e) => setClienteTelefono(e.target.value)}
        />

        <input
          type="text"
          placeholder="Servicio (ej. Tinte, Corte, Peinado)"
          required
          className="border p-3 rounded-lg w-full col-span-full"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
        />

        <div>
          <label className="text-xs text-gray-500 font-semibold block mb-1">Inicio</label>
          <input
            type="datetime-local"
            required
            className="border p-3 rounded-lg w-full"
            value={fechaHoraInicio}
            onChange={(e) => setFechaHoraInicio(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-semibold block mb-1">Fin</label>
          <input
            type="datetime-local"
            required
            className="border p-3 rounded-lg w-full"
            value={fechaHoraFin}
            onChange={(e) => setFechaHoraFin(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-full bg-pink-600 text-white font-bold p-3 rounded-lg hover:bg-pink-700 transition"
        >
          {loading ? 'Validando horario...' : 'Confirmar Cita'}
        </button>
      </form>

      {/* Lista de Citas */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg text-gray-700">Citas Agendadas</h2>
        {citas.length === 0 ? (
          <p className="text-gray-500">No hay citas registradas.</p>
        ) : (
          citas.map((c) => (
            <div key={c.idCita} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{c.clienteNombre}</h3>
                <p className="text-pink-600 font-medium text-sm">{c.servicio}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <Clock size={14} /> 
                  {new Date(c.fechaHoraInicio).toLocaleString('es-MX')} - {new Date(c.fechaHoraFin).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <Phone size={14} /> {c.clienteTelefono}
                </p>
              </div>

              <button
                onClick={() => enviarRecordatorioWhatsApp(c)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green-600 transition"
              >
                <MessageSquare size={18} />
                Enviar Recordatorio
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}