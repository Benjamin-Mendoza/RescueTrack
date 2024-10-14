'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:8081/usuarios'); 
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        const data = await response.json();
        setUsuarios(data || []);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setError('Error al obtener los usuarios');
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {usuarios.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Rol</th>
              <th>Email</th>
              <th>Compañia</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.email}</td>
                <td>{usuario.compania}</td>
                <td>
                  <button>Editar</button> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios disponibles</p>
      )}
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default Usuarios;
