import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, AlertCircle, CheckCircle2 } from 'lucide-react';

// Definimos la estructura de los datos que nos envía Spring Boot
interface Producto {
  idProducto: number;
  nombre: string;
  codigoSku: string;
  stockActual: number;
  precioVenta: number;
  alertaStockBajo: boolean;
}

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);

  // Cuando la pantalla cargue, pedimos los datos a la API
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
      // Contenedor principal que simula la pantalla de un móvil (max-w-md)
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen pb-20">

        {/* Header */}
        <div className="bg-blue-600 text-white p-4 shadow-md rounded-b-2xl mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={28} />
            Inventario
          </h1>
          <p className="text-blue-100 text-sm mt-1">Gestión de stock de la estética</p>
        </div>

        {/* Lista de Productos */}
        <div className="px-4 space-y-3">
          {productos.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Cargando productos...</p>
          ) : (
              productos.map((producto) => (
                  <div key={producto.idProducto} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">

                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{producto.nombre}</h3>
                      <p className="text-gray-500 text-sm mb-2">SKU: {producto.codigoSku} • ${producto.precioVenta}</p>

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

                    {/* Botón táctil grande para registrar entrada */}
                    <button className="bg-blue-50 text-blue-600 font-bold w-14 h-14 rounded-full flex justify-center items-center active:bg-blue-200 transition">
                      +
                    </button>

                  </div>
              ))
          )}
        </div>

      </div>
  );
}

export default App;