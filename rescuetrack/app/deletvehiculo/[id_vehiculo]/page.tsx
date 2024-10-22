'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

// Define las props del componente
interface VehiculoDeletePageProps {
  params: {
    id_vehiculo: string; // Usa string, ya que params generalmente son cadenas
  };
}

async function deleteVehiculo(id_vehiculo: number) {
  const res = await fetch(`https://rescuedesplegado.onrender.com/deletevehiculo/${id_vehiculo}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar el vehículo');
  }
  return res.json();
}

const VehiculoDeletePage = ({ params }: VehiculoDeletePageProps) => {
  const router = useRouter();
  const id_vehiculo = parseInt(params.id_vehiculo, 10); // Convierte a número

  const handleDelete = async () => {
    try {
      await deleteVehiculo(id_vehiculo);
      alert('Vehículo eliminado con éxito');
      router.push('/vehiculoslista'); // Redirige a la lista de vehículos
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      alert('Hubo un problema al eliminar el vehículo');
    }
  };

  return (
    <div>
      <h1>Eliminar Vehículo</h1>
      <button onClick={handleDelete}>Eliminar Vehículo</button>
    </div>
  );
};

// Asegúrate de exportar el componente
export default VehiculoDeletePage;
