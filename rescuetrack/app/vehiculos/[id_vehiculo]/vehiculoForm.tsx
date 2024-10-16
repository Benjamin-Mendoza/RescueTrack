'use client';

import { useState } from 'react';
import './editar.css'; // Asegúrate de tener este archivo CSS

interface Vehiculo {
  id_vehiculo: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  estado_vehiculo: string;
  kilometraje: number;
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
  const [tipo_vehiculo, setTipo] = useState(vehiculo.tipo_vehiculo);
  const [estado_vehiculo, setEstado] = useState(vehiculo.estado_vehiculo);
  const [kilometraje, setKilometraje] = useState(vehiculo.kilometraje);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVehiculo(vehiculo.id_vehiculo, { marca, modelo, anio, tipo_vehiculo, estado_vehiculo, kilometraje });
      alert('Vehículo actualizado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el vehículo');
    }
  };

  return (
    <div className="c2">
      <h2 className="titulo">Editar Vehículo</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <div>
            <label className="label">Marca:</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Modelo:</label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label className="label">Año:</label>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="label">Tipo de Vehículo:</label>
            <input
              type="text"
              value={tipo_vehiculo}
              onChange={(e) => setTipo(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label className="label">Estado:</label>
            <input
              type="text"
              value={estado_vehiculo}
              onChange={(e) => setEstado(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Kilometraje:</label>
            <input
              type="number"
              value={kilometraje}
              onChange={(e) => setKilometraje(Number(e.target.value))}
              className="input"
            />
          </div>
        </div>
        <button type="submit" className="button">Guardar cambios</button>
      </form>
    </div>
  );
}
