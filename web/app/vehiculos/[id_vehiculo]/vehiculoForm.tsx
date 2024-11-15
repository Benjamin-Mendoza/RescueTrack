'use client';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation'; 
import './editar.css'; 

interface Vehiculo {
  id_vehiculo: number;
  patente: string; 
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

interface VehiculoFormProps {
  vehiculo: Vehiculo;
  setVehiculo: Dispatch<SetStateAction<Vehiculo | null>>;
}

export default function VehiculoForm({ vehiculo, setVehiculo }: VehiculoFormProps) {
  const router = useRouter();
  const [estado_vehiculo, setEstado] = useState(vehiculo.estado_vehiculo);
  const [kilometraje, setKilometraje] = useState(vehiculo.kilometraje);

  useEffect(() => {
    setEstado(vehiculo.estado_vehiculo);
    setKilometraje(vehiculo.kilometraje);
  }, [vehiculo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (kilometraje < vehiculo.kilometraje) {
      alert('El kilometraje no puede ser menor al kilometraje actual');
      return;
    }

    if (kilometraje > 500000) {
      alert('El kilometraje no puede ser mayor a 500,000');
      return;
    }

    try {
      await updateVehiculo(vehiculo.id_vehiculo, { estado_vehiculo, kilometraje });
      alert('Vehículo actualizado con éxito');

      const updatedVehiculo = { ...vehiculo, estado_vehiculo, kilometraje };
      setVehiculo(updatedVehiculo);
      
      router.push('/lista');
    } catch (error) {
      console.error('Error en la actualización:', error);
      alert('Error al actualizar el vehículo');
    }
  };

  return (
    <div className="c2">
      <h2 className="titulo">Editar Vehículo</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <div>
            <label className="label">Estado:</label>
            <select
              value={estado_vehiculo}
              onChange={(e) => setEstado(e.target.value)}
              className="input"
            >
              <option value="Operativo">Operativo</option>
              <option value="En Mantención">En Mantención</option>
            </select>
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



