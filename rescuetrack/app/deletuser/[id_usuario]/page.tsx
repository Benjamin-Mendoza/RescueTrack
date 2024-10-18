'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

async function deleteUsuario(id_usuario: number) {
  const res = await fetch(`http://localhost:8081/deleteuser/${id_usuario}`, {
    method: 'DELETE',
  });
  const textResponse = await res.text();
  if (!res.ok) {
    console.error('Respuesta del servidor:', textResponse); 
    throw new Error(textResponse || 'Error al eliminar el usuario');
  }

  try {
    return JSON.parse(textResponse);
  } catch (error) {
    console.error('Error al parsear la respuesta:', error);
    throw new Error('Error al eliminar el usuario, la respuesta no es JSON');
  }
}

export default function UsuarioDetalles({ params }: { params: { id_usuario: string } }) {
  const router = useRouter();
  const id_usuario = Number(params.id_usuario);

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        console.log('Eliminando usuario con ID:', id_usuario);
        await deleteUsuario(id_usuario);
        alert('Usuario eliminado con éxito');
        router.push('/usuarios'); 
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }
  };

  return (
    <div>
      <h1>Detalles del Usuario</h1>
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
        Confirmar eliminación
      </button>
    </div>
  );
}

