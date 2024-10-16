'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  rol: string;
  compania: number;
}

async function getUsuario(id_usuario: number): Promise<Usuario> {
  const res = await fetch(`http://localhost:8081/usuarios/${id_usuario}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al obtener los detalles del usuario');
  }

  return res.json();
}

async function deleteUsuario(id_usuario: number) {
  const res = await fetch(`http://localhost:8081/deletuser/${id_usuario}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errorData = await res.json(); // Obtener el mensaje de error del servidor
    throw new Error(errorData.error || 'Error al eliminar el usuario');
  }

  return res.json();
}

export default function UsuarioDetalles({ params }: { params: { id_usuario: string } }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getUsuario(Number(params.id_usuario));
        setUsuario(data);
      } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    };

    fetchUsuario();
  }, [params.id_usuario]);

  const handleDelete = async () => {
    if (!usuario) {
      alert('No se puede eliminar el usuario porque no se ha cargado.');
      return;
    }

    try {
      console.log('Eliminando usuario con ID:', usuario.id_usuario);
      await deleteUsuario(usuario.id_usuario);
      alert('Usuario eliminado con éxito');
      router.push('/usuarioslista'); // Redirigir a la lista de usuarios
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  if (!usuario) {
    return <div>Cargando...</div>; // Manejo de carga
  }

  return (
    <div>
      <h1>Detalles del Usuario</h1>
      <p>Nombre: {usuario.nombre}</p>
      <p>Apellido: {usuario.apellido}</p>
      <p>Email: {usuario.email}</p>
      <p>Rol: {usuario.rol}</p>
      <p>Compañía: {usuario.compania}</p>
      <button
        onClick={handleDelete}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Eliminar Usuario
      </button>
    </div>
  );
}

