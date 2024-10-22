'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './registro.css';

const Registro = () => {
  const router = useRouter();
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
      const response = await fetch('https://rescuedesplegado.onrender.com/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Usuario registrado con éxito');
        router.push('/usuarioslista');
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          contrasenia: '',
          rol: '',
          compania: ''
        });
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
              <input 
                type="text" 
                name="nombre" 
                id="nombre" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.nombre} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium">Apellido</label>
              <input 
                type="text" 
                name="apellido" 
                id="apellido" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.apellido} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <label htmlFor="contrasenia" className="block text-sm font-medium">Contraseña</label>
              <input 
                type="password" 
                name="contrasenia" 
                id="contrasenia" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.contrasenia} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>

          <div className="input-group">
          <div>
              <label htmlFor="rol" className="block text-sm font-medium">Rol</label>
              <input 
                type="text" 
                name="rol" 
                id="rol" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.rol} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div>
              <label htmlFor="compania" className="block text-sm font-medium">Compañía</label>
              <select 
                name="compania" 
                id="compania" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.compania} 
                onChange={handleInputChange} 
                required
              >
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

          <button className="button" type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;




