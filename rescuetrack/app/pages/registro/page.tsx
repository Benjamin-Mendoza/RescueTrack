'use client';

import React, { useState } from 'react';
import './registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasenia: '',
    rol: '',
    compania: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Usuario registrado con éxito');
      } else {
        console.error('Error en el registro:', data.error);
        alert('Hubo un problema al registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el fetch:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="c1">
      <div className="c2">
        <h1 className="titulo">Registro de Usuario</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
              <input type="text" name="nombre" id="nombre" className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.nombre} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium">Apellido</label>
              <input type="text" name="apellido" id="apellido" className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.apellido} onChange={handleInputChange} />
            </div>
          </div>

          <div className="input-group">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label>
              <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="contrasenia" className="block text-sm font-medium">Contraseña</label>
              <input type="password" name="contrasenia" id="contrasenia" className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.contrasenia} onChange={handleInputChange} />
            </div>
          </div>

          <div className="input-group">
            <div>
              <label htmlFor="rol" className="block text-sm font-medium">Rol</label>
              <select name="rol" id="rol" className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.rol} onChange={handleInputChange}>
                <option value="">Seleccionar rol</option>
                <option value="secretario">Secretario</option>
                <option value="mecanico">Mecánico</option>
                <option value="capitan">Capitán</option>
                <option value="teniente">Teniente</option>
              </select>
            </div>
            <div>
              <label htmlFor="compania" className="block text-sm font-medium">Compañía</label>
              <select name="compania" id="compania" className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.compania} onChange={handleInputChange}>
                <option value="">Seleccionar compañía</option>
                <option value="1">Primera Compañía</option>
                <option value="2">Segunda Compañía</option>
                <option value="3">Tercera Compañía</option>
                <option value="4">Cuarta Compañía</option>
                <option value="5">Quinta Compañía</option>
                <option value="6">Sexta Compañía</option>
                <option value="7">Séptima Compañía</option>
                <option value="8">Octava Compañía</option>
                <option value="9">Novena Compañía</option>
                <option value="11">Undécima Compañía</option>
              </select>
            </div>
          </div>

          <button className="button" type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;


