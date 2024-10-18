'use client';

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

