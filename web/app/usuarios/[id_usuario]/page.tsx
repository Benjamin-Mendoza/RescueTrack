"use client";
import { useState, useEffect } from 'react';
import UsuarioForm from './usuarioForm';
import './formus.css';
import { useRouter } from 'next/navigation';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  rol: string;
  id_compania: number;
}

async function getUsuario(id_usuario: number): Promise<Usuario> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const res = await fetch(`http://localhost:8081/usuarios/${id_usuario}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user details');
  }

  return res.json();
}

export default function UsuarioDetalles({ params }: { params: { id_usuario: string } }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
      router.push('/login');
      return;
    }
    const cargarUsuario = async () => {
      try {
        const datosUsuario = await getUsuario(Number(params.id_usuario));
        setUsuario(datosUsuario);
      } catch (err) {
        setError('Error al cargar los detalles del usuario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [params.id_usuario]);

  if (loading) {
    return <p>Cargando detalles del usuario...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>

      {usuario ? (
        <UsuarioForm usuario={usuario} setUsuario={setUsuario} />
      ) : (
        <p>No se encontraron detalles del usuario.</p>
      )}
    </div>
  );
}
