import { useEffect, useState } from 'react';
import axios from 'axios';
import { DollarSign, TrendingDown, TrendingUp, PlusCircle } from 'lucide-react';

interface Gasto {
    idGasto: number;
    concepto: string;
    monto: number;
    fecha: string;
}

export default function Finanzas() {
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [ventasTotales, setVentasTotales] = useState<number>(15000); // MOCK: Conectar con API de Ventas posteriormente
    const [nuevoConcepto, setNuevoConcepto] = useState('');
    const [nuevoMonto, setNuevoMonto] = useState('');
    const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().split('T')[0]);

    const cargarGastos = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/gastos');
            setGastos(res.data);
        } catch (error) {
            console.error("Error al cargar gastos:", error);
        }
    };

    useEffect(() => {
        cargarGastos();
    }, []);

    const registrarGasto = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/v1/gastos', {
                concepto: nuevoConcepto,
                monto: parseFloat(nuevoMonto),
                fecha: nuevaFecha
            });
            setNuevoConcepto('');
            setNuevoMonto('');
            cargarGastos();
        } catch (error) {
            console.error("Error al registrar gasto:", error);
        }
    };

    const gastosTotales = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const gananciaNeta = ventasTotales - gastosTotales;

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-6 shadow-md mb-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign size={28} />
                        Finanzas y Reportes
                    </h1>
                    <p className="text-emerald-100 text-sm mt-1">Control de flujo de caja y ganancias</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Dashboard Principal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm font-semibold flex items-center gap-1">
                            <TrendingUp size={16} className="text-blue-500"/> Ingresos (Ventas)
                        </p>
                        <p className="text-2xl font-bold text-gray-800 mt-2">${ventasTotales.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm font-semibold flex items-center gap-1">
                            <TrendingDown size={16} className="text-red-500"/> Gastos (Egresos)
                        </p>
                        <p className="text-2xl font-bold text-red-600 mt-2">${gastosTotales.toFixed(2)}</p>
                    </div>
                    <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 shadow-sm">
                        <p className="text-emerald-700 text-sm font-semibold">Ganancia Neta</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">${gananciaNeta.toFixed(2)}</p>
                    </div>
                </div>

                {/* Registro de Gastos Diarios */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <PlusCircle size={20} className="text-emerald-600" /> Registrar Salida de Dinero
                    </h3>
                    <form onSubmit={registrarGasto} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Concepto (ej. Luz, Material)</label>
                            <input type="text" required value={nuevoConcepto} onChange={e => setNuevoConcepto(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Monto ($)</label>
                            <input type="number" step="0.01" required value={nuevoMonto} onChange={e => setNuevoMonto(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Fecha</label>
                            <input type="date" required value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                        </div>
                        <button type="submit" className="bg-emerald-600 text-white font-bold p-2 rounded-lg hover:bg-emerald-700 transition-colors h-[42px]">
                            Guardar Gasto
                        </button>
                    </form>
                </div>

                {/* Historial de Gastos */}
                <h3 className="font-bold text-gray-800 mb-4">Últimos Gastos Registrados</h3>
                <div className="space-y-3">
                    {gastos.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay gastos registrados aún.</p>
                    ) : (
                        gastos.map(gasto => (
                            <div key={gasto.idGasto} className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                <div>
                                    <p className="font-bold text-gray-800">{gasto.concepto}</p>
                                    <p className="text-xs text-gray-500">{gasto.fecha}</p>
                                </div>
                                <p className="font-bold text-red-600">-${gasto.monto.toFixed(2)}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}