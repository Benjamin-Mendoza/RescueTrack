"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
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
  compania: string;
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
  const [compania, setCompania] = useState('');

  const router = useRouter(); 

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
        compania,
      };

      await createVehiculo(newVehiculo);
      alert('Vehículo agregado con éxito');
      router.push('/lista'); 
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
      </div>

      <div className="input-group-row">
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
        <div className="input-group">
          <label className="label">Tipo de Vehículo:</label>
          <select
            value={tipo_vehiculo}
            onChange={(e) => setTipoVehiculo(e.target.value)}
            className="input"
            required
          >
            <option value="" disabled>Seleccionar Tipo</option>
            <option value="Carro bomba">Carro bomba</option>
            <option value="Carro de rescate técnico especializado">Carro de rescate técnico especializado</option>
            <option value="Carro forestal">Carro forestal</option>
            <option value="Carro portaescala">Carro portaescala</option>
            <option value="Carro bomba con escala telescópica">Carro bomba con escala telescópica</option>
            <option value="Carro de rescate y apoyo en abastecimiento de agua">Carro de rescate y apoyo en abastecimiento de agua</option>
            <option value="Unidad Básica HAZ-MAT">Unidad Básica HAZ-MAT</option>
            <option value="Unidad usada como puesto de comunicación">Unidad usada como puesto de comunicación</option>
            <option value="Carro de rescate pesado">Carro de rescate pesado</option>
            <option value="Carro cisterna">Carro cisterna</option>
            <option value="Carro bomba de segundo socorro">Carro bomba de segundo socorro</option>
          </select>
        </div>
        <div className="input-group">
          <label className="label">Estado del Vehículo:</label>
          <select
            value={estado_vehiculo}
            onChange={(e) => setEstadoVehiculo(e.target.value)}
            className="input"
            required
          >
            <option value="" disabled>Seleccionar Estado</option>
            <option value="Operativo">Operativo</option>
            <option value="En Mantención">En Mantención</option>
          </select>
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
          <select
            value={compania}
            onChange={(e) => setCompania(e.target.value)}
            className="input"
            required
          >
                <option value="" disabled>Seleccionar Compañía</option>
                <option value="PRIMERA COMPAÑÍA">PRIMERA COMPAÑÍA "Eduardo Cornou Chabry"</option>
                <option value="SEGUNDA COMPAÑÍA">SEGUNDA COMPAÑÍA "Zapadores"</option>
                <option value="TERCERA COMPAÑÍA">TERCERA COMPAÑÍA "Salvadora y Guardia de la Propiedad"</option>
                <option value="CUARTA COMPAÑÍA">CUARTA COMPAÑÍA "Umberto Primo"</option>
                <option value="QUINTA COMPAÑÍA">QUINTA COMPAÑÍA "Bomba Chile"</option>
                <option value="SEXTA COMPAÑÍA">SEXTA COMPAÑÍA "Salvadora"</option>
                <option value="SÉPTIMA COMPAÑÍA">SÉPTIMA COMPAÑÍA "Bomba Almirante Calixto Rogers"</option>
                <option value="OCTAVA COMPAÑÍA">OCTAVA COMPAÑÍA "Bomba Huachipato"</option>
                <option value="NOVENA COMPAÑÍA">NOVENA COMPAÑÍA "Juan Guillermo Sosa Severino"</option>
                <option value="UNDÉCIMA COMPAÑÍA">UNDÉCIMA COMPAÑÍA "Bomba San Vicente"</option>
          </select>
        </div>
      </div>

      <button type="submit" className="button">Agregar Vehículo</button>
    </form>
  );
}







