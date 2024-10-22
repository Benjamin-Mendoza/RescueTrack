'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation'; 
import './usuario.css';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  rol: string;
  compania: string;
}

async function getUsuario(id_usuario: number): Promise<Usuario> {
  const res = await fetch(`https://rescuedesplegado.onrender.com/usuarios/${id_usuario}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user details');
  }

  return res.json();
}

async function updateUsuario(id_usuario: number, updatedData: Partial<Usuario>) {
  const res = await fetch(`https://rescuedesplegado.onrender.com/usuarios/${id_usuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error('Failed to update user details');
  }

  return res.json();
}

interface UsuarioFormProps {
  usuario: Usuario;
  setUsuario: Dispatch<SetStateAction<Usuario | null>>;
}

export default function UsuarioForm({ usuario, setUsuario }: UsuarioFormProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellido, setApellido] = useState(usuario.apellido);
  const [email, setEmail] = useState(usuario.email);
  const [contrasenia, setContrasenia] = useState(usuario.contrasenia);
  const [rol, setRol] = useState(usuario.rol);
  const [compania, setCompania] = useState(usuario.compania);

  useEffect(() => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEmail(usuario.email);
    setContrasenia(usuario.contrasenia);
    setRol(usuario.rol);
    setCompania(usuario.compania);
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUsuario(usuario.id_usuario, { nombre, apellido, email, contrasenia, rol, compania });
      alert('Usuario actualizado con éxito');
      const updatedUsuario = await getUsuario(usuario.id_usuario);
      setUsuario(updatedUsuario);
      router.push('/usuarioslista'); 
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el usuario');
    }
  };

  return (
    <div className="c2">
      <h2 className="titulo">Editar Usuario</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <div>
            <label htmlFor="nombre" className="label">Nombre:</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="apellido" className="label">Apellido:</label>
            <input
              id="apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label htmlFor="email" className="label">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="contrasenia" className="label">Contraseña:</label>
            <input
              id="contrasenia"
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label htmlFor="rol" className="label">Rol:</label>
            <input
              id="rol"
              type="text"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="compania" className="label">Compañía:</label>
            <select
              id="compania"
              value={compania}
              onChange={(e) => setCompania(e.target.value)}
              className="select">
              <option value="" disabled>Seleccionar Compañía</option>
              <option value="PRIMERA COMPAÑÍA">PRIMERA COMPAÑÍA Eduardo Cornou Chabry</option>
              <option value="SEGUNDA COMPAÑÍA">SEGUNDA COMPAÑÍA Zapadores</option>
              <option value="TERCERA COMPAÑÍA">TERCERA COMPAÑÍA Salvadora y Guardia de la Propiedad</option>
              <option value="CUARTA COMPAÑÍA">CUARTA COMPAÑÍA Umberto Primo</option>
              <option value="QUINTA COMPAÑÍA">QUINTA COMPAÑÍA Bomba Chile</option>
              <option value="SEXTA COMPAÑÍA">SEXTA COMPAÑÍA Salvadora</option>
              <option value="SÉPTIMA COMPAÑÍA">SÉPTIMA COMPAÑÍA Bomba Almirante Calixto Rogers</option>
              <option value="OCTAVA COMPAÑÍA">OCTAVA COMPAÑÍA Bomba Huachipato</option>
              <option value="NOVENA COMPAÑÍA">NOVENA COMPAÑÍA Juan Guillermo Sosa Severino</option>
              <option value="UNDÉCIMA COMPAÑÍA">UNDÉCIMA COMPAÑÍA Bomba San Vicente</option>
            </select>
          </div>
        </div>

        <button type="submit" className="button">Guardar cambios</button>
      </form>
    </div>
  );
}
