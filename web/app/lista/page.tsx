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
  id_compania: number;
}

async function getVehiculos() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible. El usuario no está autenticado.');
  }

  const res = await fetch('http://localhost:8081/vehiculos', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) {
    throw new Error('No autorizado. Verifica que el token es válido y tiene permisos.');
  }

  if (!res.ok) {
    throw new Error('Failed to fetch vehicles');
  }

  return res.json();
}

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [userCompanyId, setUserCompanyId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    const fetchVehiculos = async () => {
      try {
        const data = await getVehiculos();
        setVehiculos(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          if (error.message.includes('No autorizado')) {
            alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
            router.push('/login');
          }
        }
      }
    };
    fetchVehiculos();
  }, [router]);

  const handleVerDetalles = (id_vehiculo: number) => {
    router.push(`/vehiculos/${id_vehiculo}`);
  };

  const handleVerMantenimientos = (id_vehiculo: number) => {
    router.push(`/mantencion/${id_vehiculo}`);
  };

  const irAAgregarVehiculo = () => {
    router.push('/nuevo_vehiculo');
  };

  const handleFiltroEstadoCambio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(e.target.value);
  };

  const handleEliminarVehiculo = async (id_vehiculo: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      try {
        await deleteVehiculo(id_vehiculo);
        alert('Vehículo eliminado con éxito');
        setVehiculos((prev) => prev.filter((vehiculo) => vehiculo.id_vehiculo !== id_vehiculo));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error al eliminar el vehículo:', error.message);
          alert('Error al eliminar el vehículo: ' + error.message);
        } else {
          console.error('Error desconocido:', error);
          alert('Error desconocido al eliminar el vehículo.');
        }
      }
    }
  };

  const vehiculosFiltrados = vehiculos
    .filter((vehiculo) => userCompanyId === null || vehiculo.id_compania === userCompanyId)
    .filter((vehiculo) => (filtroEstado ? vehiculo.estado_vehiculo === filtroEstado : true));

  return (
    <div className="container">

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="button-agregar" onClick={irAAgregarVehiculo}>
          Agregar vehículo
        </button>
      </div>

      <div className="filtros">
        <label>
          Estado:
          <select value={filtroEstado} onChange={handleFiltroEstadoCambio}>
            <option value="">Todos</option>
            <option value="En Mantención">En Mantención</option>
            <option value="Operativo">Operativo</option>
          </select>
        </label>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Kilometraje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculosFiltrados.map((vehiculo) => (
            <tr key={vehiculo.id_vehiculo}>
              <td>{vehiculo.patente}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.anio}</td>
              <td>{vehiculo.tipo_vehiculo}</td>
              <td>{vehiculo.estado_vehiculo}</td>
              <td>{vehiculo.kilometraje}</td>
              <td>
              <button onClick={() => handleVerDetalles(vehiculo.id_vehiculo)} className="button">
                  Editar
                </button>

                <button onClick={() => handleEliminarVehiculo(vehiculo.id_vehiculo)} className="button-eliminar">
                  Eliminar
                </button>
                <button onClick={() => handleVerMantenimientos(vehiculo.id_vehiculo)} className="button-mantencion">
                  Mantenciones
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
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8081/deletevehiculo/${id_vehiculo}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete vehicle');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
