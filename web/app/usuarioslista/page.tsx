'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './usuario.css'; 
import Swal from 'sweetalert2';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  rol: string;
  id_compania: number;
}

async function getUsuarios() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch('http://localhost:8081/usuarios', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

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
  const [userCompanyId, setUserCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const usuarios = await getUsuarios();
        setUsuarios(usuarios);
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

    fetchUsuarios();
  }, [router]);

  const handleVerDetalles = (id_usuario: number) => {
    router.push(`/usuarios/${id_usuario}`);
  };

  const handleEliminar = async (id_usuario: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará permanentemente al usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#154780',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUsuario(id_usuario);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El usuario ha sido eliminado correctamente.',
            confirmButtonColor: '#154780',
          });
          const usuariosActualizados = await getUsuarios();
          setUsuarios(usuariosActualizados);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            text: 'Hubo un problema al eliminar el usuario. Intenta nuevamente.',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  const handleAñadirUsuario = () => {
    router.push('/registro');
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    userCompanyId === null || usuario.id_compania === userCompanyId
  );

  return (
    <div className="container">
      <div className="header-button">
        <button className="button-agregar" onClick={handleAñadirUsuario}>
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
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.id_compania}</td>
              <td className="table-actions">
                <div className="table-actions">
                  <button
                    onClick={() => handleVerDetalles(usuario.id_usuario)}
                    className="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(usuario.id_usuario)}
                    className="button-eliminar"
                    disabled={usuario.rol === 'secretario' && usuarios.filter(u => u.rol === 'secretario').length === 1}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
