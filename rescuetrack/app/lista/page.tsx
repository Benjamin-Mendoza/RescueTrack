// app/lista/page.tsx
'use client'
import { useRouter } from 'next/navigation';

interface Vehiculo {
  id_vehiculo: number;
  patente: string;
  marca: string;
}

async function getVehiculos() {
  const res = await fetch('http://localhost:8081/vehiculos', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch vehicles');
  }
  return res.json();
}

export default async function VehiculosPage() {
  const router = useRouter();
  const vehiculos: Vehiculo[] = await getVehiculos();

  // Función para manejar el botón de ver detalles
  const handleVerDetalles = (id_vehiculo: number) => {
    router.push(`/vehiculos/${id_vehiculo}`);
  };

  return (
    <div>
      <h1>Lista de Vehículos</h1>
      <table>
        <thead>
          <tr>
            <th>Patente</th>
            <th>Marca</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id_vehiculo}>
              <td>{vehiculo.patente}</td>
              <td>{vehiculo.marca}</td>
              <td>
                <button onClick={() => handleVerDetalles(vehiculo.id_vehiculo)}>
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
