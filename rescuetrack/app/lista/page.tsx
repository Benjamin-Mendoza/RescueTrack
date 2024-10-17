// app/lista/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './vehiculos.css';

interface Vehiculo {
  id_vehiculo: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  estado_vehiculo: string;
  kilometraje: number;
  compania: string;
}

async function getVehiculos() {
  const res = await fetch('http://localhost:8081/vehiculos', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch vehicles');
  }
  return res.json();
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCompania, setFiltroCompania] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchVehiculos = async () => {
      const data = await getVehiculos();
      setVehiculos(data);
    };

    fetchVehiculos();
  }, []);

  const handleVerDetalles = (id_vehiculo: number) => {
    router.push(`/vehiculos/${id_vehiculo}`);
  };

  const irAAgregarVehiculo = () => {
    router.push('/nuevo_vehiculo');
  };

  const handleFiltroEstadoCambio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(e.target.value);
  };

  const handleFiltroCompaniaCambio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroCompania(e.target.value);
  };

  const handleEliminarVehiculo = async (id_vehiculo: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      try {
        await deleteVehiculo(id_vehiculo);
        alert('Vehículo eliminado con éxito');
        setVehiculos((prev) => prev.filter((vehiculo) => vehiculo.id_vehiculo !== id_vehiculo));
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el vehículo: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }
  };

  const vehiculosFiltrados = vehiculos
    .filter(vehiculo => (filtroEstado ? vehiculo.estado_vehiculo === filtroEstado : true))
    .filter(vehiculo => (filtroCompania ? vehiculo.compania === filtroCompania : true));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Vehículos</h1>

      <div className="filtros-container">
        <div className="filtro-item">
          <label htmlFor="filtroEstado" className="filtro-label">Filtrar por Estado:</label>
          <select id="filtroEstado" value={filtroEstado} onChange={handleFiltroEstadoCambio} className="filtro-select">
            <option value="">Todos</option>
            <option value="Operativo">Operativo</option>
            <option value="En Mantención">En Mantención</option>
          </select>
        </div>

        <div className="filtro-item">
          <label htmlFor="filtroCompania" className="filtro-label">Filtrar por Compañía:</label>
          <select id="filtroCompania" value={filtroCompania} onChange={handleFiltroCompaniaCambio} className="filtro-select">
            <option value="">Todas</option>
            <option value="1">Primera</option>
            <option value="2">Segunda</option>
            <option value="3">Tercera</option>
            <option value="4">Cuarta</option>
            <option value="5">Quinta</option>
            <option value="6">Sexta</option>
            <option value="7">Séptima</option>
            <option value="8">Octava</option>
            <option value="9">Novena</option>
            <option value="11">Undécima</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          style={{
            backgroundColor: '#154780',
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
            <th style={{ padding: '10px', textAlign: 'left' }}>Compañía</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculosFiltrados.map((vehiculo) => (
            <tr key={vehiculo.id_vehiculo} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{vehiculo.patente}</td>
              <td style={{ padding: '10px' }}>{vehiculo.marca}</td>
              <td style={{ padding: '10px' }}>{vehiculo.modelo}</td>
              <td style={{ padding: '10px' }}>{vehiculo.anio}</td>
              <td style={{ padding: '10px' }}>{vehiculo.tipo_vehiculo}</td>
              <td style={{ padding: '10px' }}>{vehiculo.estado_vehiculo}</td>
              <td style={{ padding: '10px' }}>{vehiculo.kilometraje}</td>
              <td style={{ padding: '10px' }}>{vehiculo.compania}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleVerDetalles(vehiculo.id_vehiculo)}
                  style={{
                    backgroundColor: '#154780',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleEliminarVehiculo(vehiculo.id_vehiculo)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function deleteVehiculo(id_vehiculo: number) {
  const res = await fetch(`http://localhost:8081/deletevehiculo/${id_vehiculo}`, {
    method: 'DELETE',
  });

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await res.json();
    if (!res.ok) {
      throw new Error(errorData.error || 'Error al eliminar el vehículo');
    }
    return errorData;
  } else {
    const errorText = await res.text(); 
    throw new Error(`Error no JSON: ${errorText}`);
  }
}




