// app/lista/page.tsx
'use client';
import { useRouter } from 'next/navigation';

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

  const irAAgregarVehiculo = () => {
    router.push('/nuevo_vehiculo');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Vehículos</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }} 
          onClick={irAAgregarVehiculo}
        >
          Agregar vehículo
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Patente</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Marca</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Modelo</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Año</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Tipo Vehiculo</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Estado Vehiculo</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Kilometraje</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id_vehiculo} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{vehiculo.patente}</td>
              <td style={{ padding: '10px' }}>{vehiculo.marca}</td>
              <td style={{ padding: '10px' }}>{vehiculo.modelo}</td>
              <td style={{ padding: '10px' }}>{vehiculo.anio}</td>
              <td style={{ padding: '10px' }}>{vehiculo.tipo_vehiculo}</td>
              <td style={{ padding: '10px' }}>{vehiculo.estado_vehiculo}</td>
              <td style={{ padding: '10px' }}>{vehiculo.kilometraje}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleVerDetalles(vehiculo.id_vehiculo)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
