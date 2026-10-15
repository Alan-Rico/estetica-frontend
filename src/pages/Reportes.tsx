import React, { useState } from 'react';
import axios from 'axios';

export default function Reportes() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const descargarExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Petición indicando que esperamos un archivo binario (blob)
      const response = await axios.get('http://localhost:8080/api/v1/reportes/excel/ventas', {
        headers: { Authorization: `Bearer ${token}` },
        params: { inicio: fechaInicio, fin: fechaFin },
        responseType: 'blob', 
      });

      // Crear un enlace temporal en el navegador para descargar el archivo automáticamente
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'balance_ventas.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Error al descargar el reporte', error);
      alert('No se pudo descargar el reporte.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Centro de Descargas y Reportes</h2>
      
      <div style={{ margin: '20px 0' }}>
        <label>
          Fecha Inicio: 
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        </label>
        <label style={{ marginLeft: '15px' }}>
          Fecha Fin: 
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </label>
      </div>

      <button 
        onClick={descargarExcel}
        style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Descargar Balance en Excel
      </button>
    </div>
  );
}