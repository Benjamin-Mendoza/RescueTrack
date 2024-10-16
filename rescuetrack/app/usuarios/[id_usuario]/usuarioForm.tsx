'use client';

import { useState } from 'react';
import './usuario.css'; // Asegúrate de tener este archivo CSS

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  rol: string;
  compania: number;
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

export default function UsuarioForm({ usuario }: { usuario: Usuario }) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellido, setApellido] = useState(usuario.apellido);
  const [email, setEmail] = useState(usuario.email);
  const [contrasenia, setContrasenia] = useState(usuario.contrasenia);
  const [rol, setRol] = useState(usuario.rol);
  const [compania, setCompania] = useState(usuario.compania);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUsuario(usuario.id_usuario, { nombre, apellido, email, contrasenia, rol, compania });
      alert('Usuario actualizado con éxito');
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
            <input
              type="text"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Compañía:</label>
            <input
              type="number"
              value={compania}
              onChange={(e) => setCompania(Number(e.target.value))}
              className="input"
            />
          </div>
        </div>
        <button type="submit" className="button">Guardar cambios</button>
      </form>
    </div>
  );
}


