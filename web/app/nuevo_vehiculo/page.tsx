"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './supabaseClient';
import Swal from 'sweetalert2';
import './registrovehiculo.css';

interface Vehiculo {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  estado_vehiculo: string;
  kilometraje: number;
  id_compania: number;
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
  const [id_compania, setCompania] = useState('');

  const router = useRouter(); 
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !patente || !marca || !modelo || !anio || !tipo_vehiculo || 
      !estado_vehiculo || !kilometraje || !id_compania
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios',
        confirmButtonColor: '#154780',
      });
      return;
    }

    try {
      const newVehiculo: Vehiculo = {
        patente,
        marca,
        modelo,
        anio: Number(anio),
        tipo_vehiculo,
        estado_vehiculo,
        kilometraje: Number(kilometraje),
        id_compania: Number(id_compania),
      };

      await createVehiculo(newVehiculo);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Vehículo agregado con éxito',
        confirmButtonColor: '#154780',
      });

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al agregar el vehículo',
        confirmButtonColor: '#154780',
      });
    }
  };

  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/[^A-Z0-9]/g, ''); 
    if (input.length <= 6) { 
      setPatente(input);
    }
  };

  const handleMarcaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/[^a-zA-Z\s]/g, '');
    if (input.length <= 15) { 
      setMarca(input);
    }
  };

  const handleModeloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/[^A-Z0-9]/g, ''); 
    if (input.length <= 15) {
      setModelo(input);
    }
  };

  const handleAnioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (value === '') {
      setAnio(''); 
    } else if (/^\d{1,4}$/.test(value)) { 
      const year = Number(value);
    
      if (value.length === 4) {
        if (year >= 1990 && year <= currentYear) {
          setAnio(year)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Año inválido',
            text: `El año debe estar entre 1990 y ${currentYear}`,
            confirmButtonColor: '#154780',
          });
          setAnio('');
        }
      } else {
        setAnio(Number(value)); 
      }
    }
  };
  
  const handleKilometrajeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 0 && value <= 500000) {
      setKilometraje(value);
    } else {
      setKilometraje(''); 
      Swal.fire({
        icon: 'error',
        title: 'Kilometraje inválido',
        text: 'El kilometraje debe estar entre 1 y 500,000 km',
        confirmButtonColor: '#154780',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="titulo">Agregar Vehículo</h2>

      <div className="input-group-row">
        <div className="input-group">
          <label className="label">Patente:</label>
          <input
            type="text"
            value={patente}
            onChange={handlePatenteChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Marca:</label>
          <input
            type="text"
            value={marca}
            onChange={handleMarcaChange}
            className="input"
            required
          />
        </div>
        <div className="input-group">
          <label className="label">Modelo:</label>
          <input
            type="text"
            value={modelo}
            onChange={handleModeloChange}
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
            onChange={handleAnioChange}
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
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="input-group-row">
        <div className="input-group">
          <label className="label">Kilometraje:</label>
          <input
            type="number"
            value={kilometraje}
            onChange={handleKilometrajeChange}
            className="input"
            required
          />
        </div>

        <div className="input-group">
          <label className="label">Compañía:</label>
          <select
            value={id_compania}
            onChange={(e) => setCompania(e.target.value)}
            className="input"
            required
          >
            <option value="" disabled>Seleccionar Compañía</option>
                <option value="1">PRIMERA COMPAÑÍA "Eduardo Cornou Chabry"</option>
                <option value="2">SEGUNDA COMPAÑÍA "Bomba Alemania"</option>
                <option value="3">TERCERA COMPAÑÍA "Bomba Colón"</option>
                <option value="4">CUARTA COMPAÑÍA "Bomba Talcahuano"</option>
                <option value="5">QUINTA COMPAÑÍA "Bomba Lota"</option>
                <option value="6">SEXTA COMPAÑÍA "Bomba Santa Clara"</option>
                <option value="7">SÉPTIMA COMPAÑÍA "Bomba Ríos"</option>
                <option value="8">OCTAVA COMPAÑÍA "Bomba Las Salinas"</option>
                <option value="9">NOVENA COMPAÑÍA "Bomba San Vicente"</option>
                <option value="10">DÉCIMA COMPAÑÍA "Bomba Talcahuano"</option>
                <option value="11">UNDÉCIMA COMPAÑÍA "Bomba Hualpén"</option>
          </select>
        </div>
      </div>

      <button type="submit" className="button">Agregar Vehículo</button>
    </form>
  );
}
