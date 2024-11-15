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
    id_compania: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]$/; 
    const controlKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"];
    if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    const { email, contrasenia, rol, id_compania } = formData;
    
    const emailRegex = /^[\w-]+(\.[\w-]+)*@rescue\.com$/;
    if (!emailRegex.test(email)) {
      alert('El correo electrónico debe tener el dominio @rescue.com.');
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(contrasenia)) {
      alert('La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula y una minúscula.');
      return false;
    }

    if (!rol) {
      alert('Por favor, selecciona un rol.');
      return false;
    }

    if (!id_compania) {
      alert('Por favor, selecciona una compañía.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const formDataWithIntCompania = {
      ...formData,
      id_compania: parseInt(formData.id_compania, 10)
    };
  
    console.log('Datos enviados al backend:', formDataWithIntCompania);
  
    try {
      const response = await fetch('http://localhost:8081/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithIntCompania),
      });
  
      const data = await response.json();
      console.log('Respuesta del backend:', data);
  
      if (response.ok) {
        alert('Usuario registrado con éxito');
        router.push('/usuarioslista');
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          contrasenia: '',
          rol: '',
          id_compania: ''
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
                onKeyDown={handleKeyDown} 
                required 
                maxLength={30}
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
                onKeyDown={handleKeyDown} 
                required 
                maxLength={30}
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
              <select 
                name="rol" 
                id="rol" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.rol} 
                onChange={handleInputChange} 
                required
              >
                <option value="" disabled>Seleccionar Rol</option>
                <option value="secretario">Secretario</option>
                <option value="capitan">Capitán</option>
                <option value="teniente">Teniente</option>
                <option value="mecanico">Mecánico</option>
              </select>
            </div>
            <div>
              <label htmlFor="id_compania" className="block text-sm font-medium">Compañía</label>
              <select 
                name="id_compania" 
                id="id_compania" 
                className="mt-1 block w-full px-3 py-2 border rounded-md" 
                value={formData.id_compania} 
                onChange={handleInputChange} 
                required
              >
                <option value="" disabled>Seleccionar Compañía</option>
                <option value="1">PRIMERA COMPAÑÍA "Eduardo Cornou Chabry"</option>
                <option value="2">SEGUNDA COMPAÑÍA "Zapadores"</option>
                <option value="3">TERCERA COMPAÑÍA "Salvadora y Guardia de la Propiedad"</option>
                <option value="4">CUARTA COMPAÑÍA "Umberto Primo"</option>
                <option value="5">QUINTA COMPAÑÍA "Bomba Chile"</option>
                <option value="6">SEXTA COMPAÑÍA "Salvadora"</option>
                <option value="7">SÉPTIMA COMPAÑÍA "Bomba Almirante Calixto Rogers"</option>
                <option value="8">OCTAVA COMPAÑÍA "Bomba Huachipato"</option>
                <option value="9">NOVENA COMPAÑÍA "Juan Guillermo Sosa Severino"</option>
                <option value="11">UNDÉCIMA COMPAÑÍA "Bomba San Vicente"</option>
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

