"use client";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

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
  const res = await fetch(`http://localhost:8081/usuarios/${id_usuario}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user details');
  }

  return res.json();
}

async function updateUsuario(id_usuario: number, updatedData: Partial<Usuario>) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const res = await fetch(`http://localhost:8081/usuarios/${id_usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorDetails = await res.json();
      throw new Error(`Failed to update user details: ${errorDetails.message}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error updating user:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar el usuario',
      text: error instanceof Error ? error.message : 'Error desconocido',
      confirmButtonColor: '#3085d6',
    });
  }
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
  const [id_compania, setid_Compania] = useState<number>(usuario.id_compania || 1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Sesión expirada o no autorizada',
        text: 'Por favor, inicia sesión nuevamente.',
        confirmButtonColor: '#3085d6',
      });
      router.push('/login');
      return;
    }
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setEmail(usuario.email);
    setContrasenia(usuario.contrasenia);
    setRol(usuario.rol);
    setid_Compania(usuario.id_compania || 1);
  }, [usuario]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[a-zA-ZÀ-ÿ\s]$/;
    const controlKeys = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"];
    if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const validateForm = () => {
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
        confirmButtonColor: '#3085d6',
      });
      return false;
    }

    if (!id_compania) {
      Swal.fire({
        icon: 'warning',
        title: 'Compañía requerida',
        text: 'Por favor, selecciona una compañía.',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateUsuario(usuario.id_usuario, { nombre, apellido, email, contrasenia, rol, id_compania });
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado con éxito',
        confirmButtonColor: '#154780',
      });
      const updatedUsuario = await getUsuario(usuario.id_usuario);
      setUsuario(updatedUsuario);

      setTimeout(() => {
        router.push('/usuarioslista');
      }, 500);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el usuario',
        text: 'Hubo un problema al actualizar el usuario. Intenta nuevamente.',
        confirmButtonColor: '#154780',
      });
    }
  };

  return (
    <div className="c1">
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
                onKeyDown={handleKeyDown}
                className="input"
                required
                maxLength={30}
              />
            </div>
            <div>
              <label className="label">Apellido:</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input"
                required
                maxLength={30}
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
                required
              />
            </div>
            <div>
              <label className="label">Contraseña:</label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <div>
              <label className="label">Rol:</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="select"
                required
              >
                <option value="" disabled>Seleccionar Rol</option>
                <option value="secretario">Secretario</option>
                <option value="mecanico">Mecánico</option>
                <option value="capitan">Capitán</option>
                <option value="teniente">Teniente</option>
              </select>
            </div>
            <div>
              <label className="label">Compañía:</label>
              <select
                value={id_compania}
                onChange={(e) => setid_Compania(Number(e.target.value))}
                className="select"
                required
              >
                <option value="" disabled>Seleccionar Compañía</option>
                <option value="1">PRIMERA COMPAÑÍA "Eduardo Cornou Chabry"</option>
                <option value="2">SEGUNDA COMPAÑÍA "Zapadores"</option>
                <option value="3">TERCERA COMPAÑÍA "Salvadora y Guardia de la Propiedad"</option>
                <option value="4">CUARTA COMPAÑÍA "Umberto Primo"</option>
                <option value="5">QUINTA COMPAÑÍA "Bomba Chile"</option>
                <option value="6">SEXTA COMPAÑÍA "Bomba Talcahuano"</option>
                <option value="7">SÉPTIMA COMPAÑÍA "Bomba Chiguayante"</option>
                <option value="8">OCTAVA COMPAÑÍA "Bomba Coronel"</option>
                <option value="9">NOVENA COMPAÑÍA "Bomba Penco"</option>
                <option value="11">UNDÉCIMA COMPAÑÍA "Bomba Hualpén"</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <button type="submit" className="button">Guardar cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}
