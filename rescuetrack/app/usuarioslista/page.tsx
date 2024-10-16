// app/usuarios/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  rol: string;
  compania: number;
}

async function getUsuarios() {
  const res = await fetch('http://localhost:8081/usuarios', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  return res.json();
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuarios = await getUsuarios();
      setUsuarios(usuarios);
    };

    fetchUsuarios();
  }, []);

  const handleVerDetalles = (id_usuario: number) => {
    router.push(`/usuarios/${id_usuario}`);
  };

  const handleEliminar = (id_usuario: number) => {
    router.push(`/deletuser/${id_usuario}`);
  };

  const handleAñadirUsuario = () => {
    router.push('/registro'); // Redirige a la página de registro
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Usuarios</h1>

      {/* Botón de añadir usuario */}
      <button
        onClick={handleAñadirUsuario}
        style={{
          backgroundColor: '#008CBA', // Azul
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px', // Espacio entre el botón y la tabla
        }}
      >
        Añadir Usuario
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Apellido</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Rol</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Compañía</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{usuario.nombre}</td>
              <td style={{ padding: '10px' }}>{usuario.apellido}</td>
              <td style={{ padding: '10px' }}>{usuario.email}</td>
              <td style={{ padding: '10px' }}>{usuario.rol}</td>
              <td style={{ padding: '10px' }}>{usuario.compania}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleVerDetalles(usuario.id_usuario)}
                  style={{
                    backgroundColor: '#4CAF50',
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
                  onClick={() => handleEliminar(usuario.id_usuario)}
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




