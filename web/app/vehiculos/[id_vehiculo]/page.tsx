'use client';
import { Metadata } from 'next';
import VehiculoForm from './vehiculoForm';
import { useEffect, useState } from 'react';

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

async function getVehiculo(id_vehiculo: number): Promise<Vehiculo> {
  const res = await fetch(`http://localhost:8081/vehiculos/${id_vehiculo}`, {
    next: { revalidate: 60 }, // Revalidar cada 60 segundos
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch vehicle details');
  }
  
  return res.json();
}

export default function VehiculoDetalles({ params }: { params: { id_vehiculo: string } }) {
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  
  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const data = await getVehiculo(Number(params.id_vehiculo));
        setVehiculo(data);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      }
    };
    
    fetchVehiculo();
  }, [params.id_vehiculo]);

  if (!vehiculo) {
    return <div>Cargando detalles del vehículo...</div>; 
  }

  return (
    <div>
      <VehiculoForm vehiculo={vehiculo} setVehiculo={setVehiculo} />
    </div>
  );
}
