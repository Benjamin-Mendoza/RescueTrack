'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './usuario.css'; // Importamos el archivo CSS

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
  const res = await fetch(`http://localhost:8081/deleteuser/${id_usuario}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
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
    <div className="container">
      <div className="header-button">
        <button className="button" onClick={handleAñadirUsuario}>
          Añadir usuario
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Compañía</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.compania}</td>
              <td className="table-actions">
                <button
                  onClick={() => handleVerDetalles(usuario.id_usuario)}
                  className="button"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(usuario.id_usuario)}
                  className="button-eliminar"
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

