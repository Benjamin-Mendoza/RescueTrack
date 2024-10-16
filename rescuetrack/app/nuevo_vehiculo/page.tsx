'use client';

import { useState } from 'react';
import { supabase } from './supabaseClient'; 

interface Vehiculo {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  estado_vehiculo: string;
  kilometraje: number;
  compania: number;
}

async function createVehiculo(newVehiculo: Vehiculo) {
  const { data, error } = await supabase
    .from('vehiculo') 
    .insert([newVehiculo]);

  if (error) {
    throw new Error(error.message); 
  }

  return data;
}

export default function AgregarVehiculoForm() {
  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState<number | ''>('');
  const [tipo_vehiculo, setTipoVehiculo] = useState('');
  const [estado_vehiculo, setEstadoVehiculo] = useState('');
  const [kilometraje, setKilometraje] = useState<number | ''>('');
  const [compania, setCompania] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newVehiculo = {
        patente,
        marca,
        modelo,
        anio: Number(anio),
        tipo_vehiculo,
        estado_vehiculo,
        kilometraje: Number(kilometraje),
        compania: Number(compania),
      };

      await createVehiculo(newVehiculo);
      alert('Vehículo agregado con éxito');

      // Limpiar formulario
      setPatente('');
      setMarca('');
      setModelo('');
      setAnio('');
      setTipoVehiculo('');
      setEstadoVehiculo('');
      setKilometraje('');
      setCompania('');
    } catch (error) {
      console.error(error);
      alert('Error al agregar el vehículo');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headerStyle}>Agregar Vehículo</h2>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Patente:</label>
        <input
          type="text"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Marca:</label>
        <input
          type="text"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Modelo:</label>
        <input
          type="text"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Año:</label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Tipo de Vehículo:</label>
        <input
          type="text"
          value={tipo_vehiculo}
          onChange={(e) => setTipoVehiculo(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Estado del Vehículo:</label>
        <input
          type="text"
          value={estado_vehiculo}
          onChange={(e) => setEstadoVehiculo(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Kilometraje:</label>
        <input
          type="number"
          value={kilometraje}
          onChange={(e) => setKilometraje(Number(e.target.value))}
          style={inputStyle}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Compañía:</label>
        <input
          type="number"
          value={compania}
          onChange={(e) => setCompania(Number(e.target.value))}
          style={inputStyle}
          required
        />
      </div>

      <button type="submit" style={buttonStyle}>Agregar Vehículo</button>
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






