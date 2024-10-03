"use client";
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
}
