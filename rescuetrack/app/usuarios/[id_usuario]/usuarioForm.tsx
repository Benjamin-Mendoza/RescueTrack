'use client';

import { useState } from 'react';

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
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headerStyle}>Editar Usuario</h2>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Apellido:</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Contraseña:</label>
        <input
          type="password"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Rol:</label>
        <input
          type="text"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Compañía:</label>
        <input
          type="number"
          value={compania}
          onChange={(e) => setCompania(Number(e.target.value))}
          style={inputStyle}
        />
      </div>
      <button type="submit" style={buttonStyle}>Guardar cambios</button>
    </form>
  );
}

// Estilos en línea
const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f9f9f9',
};

const headerStyle: React.CSSProperties = {
  marginBottom: '20px',
  textAlign: 'center',
  fontSize: '24px',
  color: '#333',
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: '15px',
};

const labelStyle: React.CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '16px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};
