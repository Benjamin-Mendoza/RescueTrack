'use client';
import { useRouter } from 'next/navigation';

interface Vehiculo {
  id_vehiculo: number;
}

async function deleteVehiculo(id_vehiculo: number) {
  const res = await fetch(`http://localhost:8081/deletevehiculo/${id_vehiculo}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorData = await res.json(); 
    throw new Error(errorData.error || 'Error al eliminar el vehículo');
  }
  return res.json();
}
export default function VehiculoDetalles({ params }: { params: { id_vehiculo: string } }) {
  const router = useRouter();

  const handleDelete = async () => {
    const id_vehiculo = Number(params.id_vehiculo);
    try {
      console.log('Eliminando vehículo con ID:', id_vehiculo);
      await deleteVehiculo(id_vehiculo);
      alert('Vehículo eliminado con éxito');
      router.push('/vehiculos');
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el vehículo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    <div>
      <h1>¿Estás seguro de que deseas eliminar este vehículo?</h1>
      <button
        onClick={handleDelete}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Eliminar Vehículo
      </button>
    </div>
  );
}
