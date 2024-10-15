// src/app/vehiculos/[id_vehiculo]/page.tsx

import { Metadata } from 'next';
import VehiculoForm from './vehiculoForm';



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

// Función para obtener el vehículo de la API
async function getVehiculo(id_vehiculo: number): Promise<Vehiculo> {
  const res = await fetch(`http://localhost:8081/vehiculos/${id_vehiculo}`, {
    next: { revalidate: 60 }, // Revalidar cada 60 segundos
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch vehicle details');
  }
  
  return res.json();
}

// Componente principal
export default async function VehiculoDetalles({ params }: { params: { id_vehiculo: string } }) {
  const vehiculo = await getVehiculo(Number(params.id_vehiculo));
  
  return (
    <div>
      <h1>Detalles del Vehículo</h1>
      <VehiculoForm vehiculo={vehiculo} />
    </div>
  );
}
