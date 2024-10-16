"use client";
import { useState } from 'react';
import { supabase } from './supabaseClient'; 
import './registrovehiculo.css';

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
      const newVehiculo: Vehiculo = {
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
      console.error('Error al agregar el vehículo:', error);
      alert('Error al agregar el vehículo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-header">Agregar Vehículo</h2>

      <div className="input-group-row">
        <div className="input-group">
          <label className="label">Patente:</label>
          <input
            type="text"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Marca:</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="input"
            required
          />
        </div>
      </div>

      <div className="input-group-row">
        <div className="input-group">
          <label className="label">Modelo:</label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Año:</label>
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="input"
            required
          />
        </div>
      </div>

      <div className="input-group-row">
        <div className="input-group">
          <label className="label">Tipo de Vehículo:</label>
          <input
            type="text"
            value={tipo_vehiculo}
            onChange={(e) => setTipoVehiculo(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Estado del Vehículo:</label>
          <input
            type="text"
            value={estado_vehiculo}
            onChange={(e) => setEstadoVehiculo(e.target.value)}
            className="input"
            required
          />
        </div>
      </div>

      <div className="input-group-row">
        <div className="input-group">
          <label className="label">Kilometraje:</label>
          <input
            type="number"
            value={kilometraje}
            onChange={(e) => setKilometraje(Number(e.target.value))}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Compañía:</label>
          <input
            type="number"
            value={compania}
            onChange={(e) => setCompania(Number(e.target.value))}
            className="input"
            required
          />
        </div>
      </div>

      <button type="submit" className="button">Agregar Vehículo</button>
    </form>
  );
}







