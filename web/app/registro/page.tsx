'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
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
      Swal.fire({
        icon: 'error',
        title: 'Correo electrónico inválido',
        text: 'El correo electrónico debe tener el dominio @rescue.com.',
        confirmButtonColor: '#154780',
      });
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(contrasenia)) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula y una minúscula.',
        confirmButtonColor: '#154780',
      });
      return false;
    }

    if (!rol) {
      Swal.fire({
        icon: 'warning',
        title: 'Rol requerido',
        text: 'Por favor, selecciona un rol.',
        color: '#856404',
        confirmButtonColor: '#856404'
      });
      return false;
    }

    if (!id_compania) {
      Swal.fire({
        icon: 'warning',
        title: 'Compañía requerida',
        text: 'Por favor, selecciona una compañía.',
        color: '#856404',
        confirmButtonColor: '#856404',
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Usuario registrado con éxito.',
          confirmButtonColor: '#154780',
        });
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
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Hubo un problema al registrar el usuario.',
          confirmButtonColor: '#154780',
        });
      }
    } catch (error) {
      console.error('Error en el fetch:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Error de conexión con el servidor.',
        confirmButtonColor: '#154780',
      });
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
                <option value="2">SEGUNDA COMPAÑÍA "Bomba Alemania"</option>
                <option value="3">TERCERA COMPAÑÍA "Bomba Colón"</option>
                <option value="4">CUARTA COMPAÑÍA "Bomba Talcahuano"</option>
                <option value="5">QUINTA COMPAÑÍA "Bomba Lota"</option>
                <option value="6">SEXTA COMPAÑÍA "Bomba Santa Clara"</option>
                <option value="7">SÉPTIMA COMPAÑÍA "Bomba Ríos"</option>
                <option value="8">OCTAVA COMPAÑÍA "Bomba Las Salinas"</option>
                <option value="9">NOVENA COMPAÑÍA "Bomba San Vicente"</option>
                <option value="11">UNDÉCIMA COMPAÑÍA "Bomba Hualpén"</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button type="submit" className="button">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
