import { Metadata } from 'next';
import UsuarioForm from './usuarioForm';

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
    throw new Error('Failed to fetch user details');
  }
  
  return res.json();
}

export default async function UsuarioDetalles({ params }: { params: { id_usuario: string } }) {
  const usuario = await getUsuario(Number(params.id_usuario));
  
  return (
    <div>
      <h1>Detalles del Usuario</h1>
      <UsuarioForm usuario={usuario} />
    </div>
  );
}
