import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, User, History, ChevronDown, ChevronUp } from 'lucide-react';

interface Cliente {
    idCliente: number;
    nombre: string;
    telefono: string;
}

interface FichaTecnica {
    idFicha: number;
    fechaAplicacion: string;
    marcaTinte: string;
    tono: string;
    volumenesPeroxido: string;
    observaciones: string;
}

export default function Clientes() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [clienteExpandido, setClienteExpandido] = useState<number | null>(null);
    const [historial, setHistorial] = useState<FichaTecnica[]>([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const url = busqueda
                    ? `http://localhost:8080/api/v1/clientes?filtro=${busqueda}`
                    : 'http://localhost:8080/api/v1/clientes';
                const res = await axios.get(url);
                setClientes(res.data);
            } catch (error) {
                console.error("Error cargando clientes", error);
            }
        };

        // Un pequeño retraso para no saturar la base de datos mientras escribes
        const timeoutId = setTimeout(() => fetchClientes(), 300);
        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    const toggleHistorial = async (idCliente: number) => {
        if (clienteExpandido === idCliente) {
            setClienteExpandido(null);
            return;
        }

        setClienteExpandido(idCliente);
        setCargando(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/clientes/${idCliente}/historial-tintes`);
            setHistorial(res.data);
        } catch (error) {
            console.error("Error al cargar historial", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="bg-pink-600 text-white p-6 shadow-md mb-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <User size={28} />
                        Directorio de Clientes
                    </h1>
                    <p className="text-pink-100 text-sm mt-1">Fichas técnicas e historial de color</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Buscador Rápido */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm transition-all"
                        placeholder="Buscar por nombre o teléfono..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {/* Lista de Clientes */}
                <div className="space-y-4">
                    {clientes.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">No se encontraron clientes.</p>
                    ) : (
                        clientes.map(cliente => (
                            <div key={cliente.idCliente} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div
                                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleHistorial(cliente.idCliente)}
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{cliente.nombre}</h3>
                                        <p className="text-gray-500 text-sm mt-1">📱 {cliente.telefono || 'Sin teléfono'}</p>
                                    </div>
                                    <div className="text-pink-600 bg-pink-50 p-2 rounded-full">
                                        {clienteExpandido === cliente.idCliente ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {/* Tarjeta Expandible: Historial de Fórmulas */}
                                {clienteExpandido === cliente.idCliente && (
                                    <div className="bg-gray-50 p-5 border-t border-gray-100">
                                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
                                            <History size={18} /> Historial de Fórmulas
                                        </h4>

                                        {cargando ? (
                                            <p className="text-sm text-gray-500">Cargando...</p>
                                        ) : historial.length === 0 ? (
                                            <p className="text-sm text-gray-500 bg-white p-3 rounded-lg border border-gray-200">No hay tintes registrados para esta clienta aún.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {historial.map(ficha => (
                                                    <div key={ficha.idFicha} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold bg-pink-100 text-pink-700 px-2 py-1 rounded mb-2 inline-block">
                              {ficha.fechaAplicacion}
                            </span>
                                                        <p className="text-sm text-gray-800"><strong>Marca:</strong> {ficha.marcaTinte}</p>
                                                        <p className="text-sm text-gray-800"><strong>Tono:</strong> {ficha.tono}</p>
                                                        <p className="text-sm text-gray-800"><strong>Peróxido:</strong> {ficha.volumenesPeroxido}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}