// page.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

// Define las props del componente
interface UserDeletePageProps {
  params: {
    id_usuario: string; // Usa string, ya que params generalmente son cadenas
  };
}

async function deleteUsuario(id_usuario: number) {
  const res = await fetch(`https://rescuedesplegado.onrender.com/deleteuser/${id_usuario}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar el usuario');
  }
  return res.json();
}

const UserDeletePage = ({ params }: UserDeletePageProps) => {
  const router = useRouter();
  const id_usuario = parseInt(params.id_usuario, 10); // Convierte a número

  const handleDelete = async () => {
    try {
      await deleteUsuario(id_usuario);
      alert('Usuario eliminado con éxito');
      router.push('/usuarioslista'); // Redirige a la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Hubo un problema al eliminar el usuario');
    }
  };

  return (
    <div>
      <h1>Eliminar Usuario</h1>
      <button onClick={handleDelete}>Eliminar Usuario</button>
    </div>
  );
};

// Asegúrate de exportar el componente
export default UserDeletePage;
