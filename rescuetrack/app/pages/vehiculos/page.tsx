'use client';

import React, { useEffect, useState } from 'react';

const VehiculosPage = () => {
  const [vehiculos, setVehiculos] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await fetch('http://localhost:8081/vehiculos');
        if (!response.ok) {
          throw new Error('Error al obtener los vehículos');
        }
        const data = await response.json();
        setVehiculos(data || []); 
      } catch (error: unknown) { 
        if (error instanceof Error) {
          setError(error.message); 
        } else {
          setError('Error desconocido'); 
        }
      }
    };

    fetchVehiculos();
  }, []);

  return (
    <div>
      
      {error && <p>Error: {error}</p>}
      {vehiculos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patente</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Tipo Vehiculo</th>
              <th>Estado Vehiculo</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>{vehiculo.patente}</td>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.anio}</td>
                <td>{vehiculo.tipo_vehiculo}</td>
                <td>{vehiculo.estado_vehiculo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay vehículos disponibles.</p>
      )}
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default VehiculosPage;