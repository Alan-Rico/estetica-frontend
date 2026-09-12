import { useState } from 'react';
import { Package, Users } from 'lucide-react';
import Inventario from './Inventario';
import Clientes from './Clientes';

export default function App() {
    const [vistaActiva, setVistaActiva] = useState('inventario');

    return (
        <div className="bg-gray-100 min-h-screen relative">

            {/* Vistas Dinámicas */}
            {vistaActiva === 'inventario' ? <Inventario /> : <Clientes />}

            {/* Menú de Navegación Inferior */}
            <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                <button
                    onClick={() => setVistaActiva('inventario')}
                    className={`flex flex-col items-center p-2 w-20 rounded-xl transition-colors ${vistaActiva === 'inventario' ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Package size={24} />
                    <span className="text-xs mt-1">Inventario</span>
                </button>

                <button
                    onClick={() => setVistaActiva('clientes')}
                    className={`flex flex-col items-center p-2 w-20 rounded-xl transition-colors ${vistaActiva === 'clientes' ? 'text-pink-600 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Users size={24} />
                    <span className="text-xs mt-1">Clientes</span>
                </button>
            </div>

        </div>
    );
}