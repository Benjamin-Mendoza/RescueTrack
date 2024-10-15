// src/app/vehiculos/[id_vehiculo]/VehiculoForm.tsx

'use client';

import { useState } from 'react';

interface Vehiculo {
  id_vehiculo: number;
  marca: string;
  modelo: string;
  anio: number;
}

async function updateVehiculo(id_vehiculo: number, updatedData: Partial<Vehiculo>) {
  const res = await fetch(`http://localhost:8081/vehiculos/${id_vehiculo}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  
  if (!res.ok) {
    throw new Error('Failed to update vehicle details');
  }
  
  return res.json();
}

export default function VehiculoForm({ vehiculo }: { vehiculo: Vehiculo }) {
  const [marca, setMarca] = useState(vehiculo.marca);
  const [modelo, setModelo] = useState(vehiculo.modelo);
  const [anio, setAnio] = useState(vehiculo.anio);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVehiculo(vehiculo.id_vehiculo, { marca, modelo, anio });
      alert('Vehículo actualizado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el vehículo');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headerStyle}>Editar Vehículo</h2>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Marca:</label>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Modelo:</label>
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Año:</label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          style={inputStyle}
        />
      </div>
      <button type="submit" style={buttonStyle}>Guardar cambios</button>
    </form>
  );
}

// Estilos en línea
const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '20px',
  textAlign: 'center',
  fontSize: '24px',
  color: '#333',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '15px',
};

const labelStyle: React.CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};
