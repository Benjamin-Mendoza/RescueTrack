'use client';
import { useRouter } from 'next/navigation';

interface Usuario {
  id_usuario: number;
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
  const router = useRouter();

  const handleDelete = async () => {
    const id_usuario = Number(params.id_usuario); // Obtener el ID del usuario desde los parámetros

    try {
      console.log('Eliminando usuario con ID:', id_usuario);
      await deleteUsuario(id_usuario);
      alert('Usuario eliminado con éxito');
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    <div>
      <h1>¿Estás seguro de que deseas eliminar este usuario?</h1>
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


