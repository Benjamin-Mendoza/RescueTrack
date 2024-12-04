'use client';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El kilometraje no puede ser menor al kilometraje actual',
        confirmButtonColor: '#154780',
      });
      return;
    }

    if (kilometraje > 500000) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El kilometraje no puede ser mayor a 500,000',
        confirmButtonColor: '#154780',
      });
      return;
    }

    try {
      await updateVehiculo(vehiculo.id_vehiculo, { estado_vehiculo, kilometraje });
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Vehículo actualizado con éxito',
        confirmButtonColor: '#154780',
      });

      const updatedVehiculo = { ...vehiculo, estado_vehiculo, kilometraje };
      setVehiculo(updatedVehiculo);

      router.push('/lista');
    } catch (error) {
      console.error('Error en la actualización:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el vehículo',
        confirmButtonColor: '#154780',
      });
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
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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
