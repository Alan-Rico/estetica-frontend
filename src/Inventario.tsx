import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Producto {
    idProducto: number;
    nombre: string;
    codigoSku: string;
    stockActual: number;
    precioVenta: number;
    alertaStockBajo: boolean;
}

function Inventario() {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/productos')
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error("Error al cargar productos:", error);
            });
    }, []);

    return (
        // Contenedor principal sin límite de ancho (max-w-md eliminado)
        <div className="bg-gray-100 min-h-screen pb-10">

            {/* Header adaptable */}
            <div className="bg-blue-600 text-white p-6 shadow-md mb-8 lg:px-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Package size={28} />
                            Inventario
                        </h1>
                        <p className="text-blue-100 text-sm mt-1">Gestión de stock de la estética</p>
                    </div>
                </div>
            </div>

            {/* Contenedor centralizado para el contenido */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {productos.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10 text-lg">Cargando productos...</p>
                ) : (
                    /* Grid responsivo: 1 col (móvil) -> 2 cols (tablet) -> 3 cols (escritorio) */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {productos.map((producto) => (
                            <div key={producto.idProducto} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">

                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{producto.nombre}</h3>
                                    <p className="text-gray-500 text-sm mb-3">SKU: {producto.codigoSku} • ${producto.precioVenta}</p>

                                    {/* Semáforo de Stock */}
                                    {producto.alertaStockBajo ? (
                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                      <AlertCircle size={14} />
                      ¡Stock Bajo! ({producto.stockActual} disp.)
                    </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                      <CheckCircle2 size={14} />
                      Stock OK ({producto.stockActual} disp.)
                    </span>
                                    )}
                                </div>

                                {/* Botón táctil */}
                                <button className="bg-blue-50 text-blue-600 font-bold w-12 h-12 rounded-full flex justify-center items-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer shrink-0">
                                    +
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default Inventario;