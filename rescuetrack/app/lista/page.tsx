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
  const res = await fetch('https://rescuedesplegado.onrender.com/vehiculos', { cache: 'no-store' });
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
    <div className="container">

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
                <option value="PRIMERA COMPAÑÍA">PRIMERA COMPAÑÍA</option>
                <option value="SEGUNDA COMPAÑÍA">SEGUNDA COMPAÑÍA</option>
                <option value="TERCERA COMPAÑÍA">TERCERA COMPAÑÍA</option>
                <option value="CUARTA COMPAÑÍA">CUARTA COMPAÑÍA</option>
                <option value="QUINTA COMPAÑÍA">QUINTA COMPAÑÍA</option>
                <option value="SEXTA COMPAÑÍA">SEXTA COMPAÑÍA</option>
                <option value="SÉPTIMA COMPAÑÍA">SÉPTIMA COMPAÑÍA</option>
                <option value="OCTAVA COMPAÑÍA">OCTAVA COMPAÑÍA</option>
                <option value="NOVENA COMPAÑÍA">NOVENA COMPAÑÍA</option>
                <option value="UNDÉCIMA COMPAÑÍA">UNDÉCIMA COMPAÑÍA</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="button-agregar" onClick={irAAgregarVehiculo}>
          Agregar vehículo
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Tipo Vehiculo</th>
            <th>Estado Vehiculo</th>
            <th>Kilometraje</th>
            <th>Compañía</th>
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
              <td>{vehiculo.compania}</td>
              <td className="table-actions">
                <button onClick={() => handleVerDetalles(vehiculo.id_vehiculo)} className="button-editar">
                  Editar
                </button>

                <button onClick={() => handleEliminarVehiculo(vehiculo.id_vehiculo)} className="button-eliminar">
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
  const res = await fetch(`https://rescuedesplegado.onrender.com/deletevehiculo/${id_vehiculo}`, {
    method: 'DELETE',
  });

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const errorData = await res.json();
    if (!res.ok) {
    }
    return errorData;
  } else {
    const errorText = await res.text(); 
    throw new Error(`Error no JSON: ${errorText}`);
  }
}





