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
    throw new Error('Error al obtener los usuarios');
  }
  return res.json();
}

async function deleteUsuario(id_usuario: number) {
  const res = await fetch(`http://localhost:8081/deleteuser/${id_usuario}`, { // Corrige aquí
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al eliminar el usuario');
  }

  return res.json();
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuarios = await getUsuarios();
        setUsuarios(usuarios);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar usuarios: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    };

    fetchUsuarios();
  }, []);

  const handleVerDetalles = (id_usuario: number) => {
    router.push(`/usuarios/${id_usuario}`);
  };

  const handleEliminar = async (id_usuario: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await deleteUsuario(id_usuario);
        alert('Usuario eliminado con éxito');
        const usuariosActualizados = await getUsuarios();
        setUsuarios(usuariosActualizados);
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }
  };

  const handleAñadirUsuario = () => {
    router.push('/registro');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista de Usuarios</h1>
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
          onClick={handleAñadirUsuario}
        >
          Añadir usuario
        </button>
      </div>

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
