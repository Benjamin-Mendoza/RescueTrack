"use client";
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';


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
    alert('Error al actualizar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
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
      alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateUsuario(usuario.id_usuario, { nombre, apellido, email, contrasenia, rol, id_compania });
      alert('Usuario actualizado con éxito');
      const updatedUsuario = await getUsuario(usuario.id_usuario);
      setUsuario(updatedUsuario);

      setTimeout(() => {
        router.push('/usuarioslista'); 
      }, 500);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el usuario');
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
              <option value="6">SEXTA COMPAÑÍA "Salvadora"</option>
              <option value="7">SÉPTIMA COMPAÑÍA "Bomba Almirante Calixto Rogers"</option>
              <option value="8">OCTAVA COMPAÑÍA "Bomba Huachipato"</option>
              <option value="9">NOVENA COMPAÑÍA "Juan Guillermo Sosa Severino"</option>
              <option value="11">UNDÉCIMA COMPAÑÍA "Bomba San Vicente"</option>
            </select>
          </div>
        </div>
        <button type="submit" className="button">Guardar cambios</button>
      </form>
      </div>
    </div>
  );
}
