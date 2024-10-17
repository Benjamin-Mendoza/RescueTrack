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

async function updateUsuario(id_usuario: number, updatedData: Partial<Usuario>) {
  const res = await fetch(`http://localhost:8081/usuarios/${id_usuario}`, {
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
            <label className="label">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Apellido:</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label className="label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Contraseña:</label>
            <input
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="input"
            />
          </div>
        </div>
        <div className="input-group">
          <div>
            <label className="label">Rol:</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="select">
              <option value="secretario">Secretario</option>
              <option value="mecanico">Mecánico</option>
              <option value="capitan">Capitán</option>
              <option value="teniente">Teniente</option>
            </select>
          </div>
          <div>
            <label className="label">Compañía:</label>
            <select
              value={compania}
              onChange={(e) => setCompania(Number(e.target.value))}
              className="select">
              <option value="1">Primera</option>
              <option value="2">Segunda</option>
              <option value="3">Tercera</option>
              <option value="4">Cuarta</option>
              <option value="5">Quinta</option>
              <option value="6">Sexta</option>
              <option value="7">Septima</option>
              <option value="8">Octava</option>
              <option value="9">Novena</option>
              <option value="11">Undecima</option>
            </select>
          </div>
        </div>
        <button type="submit" className="button">Guardar cambios</button>
      </form>
    </div>
  );
}

