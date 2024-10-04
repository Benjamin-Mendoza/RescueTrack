"use client";

import { useEffect, useState } from 'react';
import SearchVehiculo from "./searchVehiculo";
import './vehiculos.css';

interface Vehiculo {
  ID_Vehiculo: number;
  Patente: string;
  Marca: string;
  Modelo: string;
  Año: number;
  Tipo_Vehiculo: string;
  Estado_Vehiculo: string;
  Kilometraje: number;
  Fecha_Registro: string;
  Compañia: number;
}

export default function Vehiculos({ searchParams }: { searchParams?: { query?: string } }) {
  const [data, setData] = useState<Vehiculo[]>([]);

  useEffect(() => {
    fetch('http://localhost:8081/vehiculo')
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos desde el backend:", data); // Verificar la estructura
        const formattedData = data.map((vehiculo: any[]) => ({
          ID_Vehiculo: vehiculo[0],
          Patente: vehiculo[1],
          Marca: vehiculo[2],
          Modelo: vehiculo[3],
          Año: vehiculo[4],
          Tipo_Vehiculo: vehiculo[5],
          Estado_Vehiculo: vehiculo[6],
          Kilometraje: vehiculo[7],
          Fecha_Registro: vehiculo[8],
          Compañia: vehiculo[9],
        }));
        setData(formattedData);
      })
      .catch(err => console.error("Error al obtener los datos:", err));
  }, []);

  const query = searchParams?.query || '';

  return (
    <div className="c3">
      <div className="c4">
        <SearchVehiculo />
      </div>
      <table className="tabla1">
        <thead>
          <tr>
            <th>Patente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Tipo Vehiculo</th>
            <th>Año</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((auto, index) => (
              <tr key={index}>
                <td>{auto.Patente}</td>
                <td>{auto.Marca}</td>
                <td>{auto.Modelo}</td>
                <td>{auto.Tipo_Vehiculo}</td>
                <td>{auto.Año}</td>
                <td>{auto.Estado_Vehiculo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No se encontraron vehículos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


/*"use client";
import { useState } from 'react';
import data from './data.json';
import SearchVehiculo from "./searchVehiculo"
import './vehiculos.css';

export default function Vehiculos({searchParams,}: {searchParams?:{query?: string;};} ) {





  const query = searchParams?.query|| '';
  const [filtro, setFiltro] = useState('all');
  const filtrado = data.filter(auto => 
    filtro === 'all' || auto.estado === filtro
  );

  return (
    <div className="c3">
      <div className="c4">
        <button className="button1" onClick={() => setFiltro('Completo')}>Completo</button>
        <button className="button1" onClick={() => setFiltro('Pendiente')}>Pendiente</button>
        <button className="button1" onClick={() => setFiltro('all')}>Todo</button>
        <SearchVehiculo />
      </div>
      <table className="tabla1">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Patente</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filtrado.map((auto, index) => (
            <tr key={index}>
              <td>{auto.tipo}</td>
              <td>{auto.marca}</td>
              <td>{auto.patente}</td>
              <td>{auto.estado} <button className="button2" disabled>Editar</button> </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/
