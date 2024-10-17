
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 8081;


app.use(cors());
app.use(express.json());



const supabaseUrl = 'https://uzqqlqvymrbuuxdvsxfb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cXFscXZ5bXJidXV4ZHZzeGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MjUxNTMsImV4cCI6MjA0NDAwMTE1M30.LVAyh2Fr2EhUlFVqjXA2tMkNk5p1Xv2iazQADo3y49Y'; 
const supabase = createClient(supabaseUrl, supabaseKey);

//GESTION DE VEHICULOS

//Obtener datos de los vehiculos

app.get('/vehiculos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('vehiculo').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los vehículos:', err);
    res.status(500).send('Error al obtener los vehículos');
  }
});

// Gestion de vehiculos por id_vehiculo
app.get('/vehiculos/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;

  try {
    const { data, error } = await supabase
      .from('vehiculo')
      .select('*')
      .eq('id_vehiculo', id_vehiculo)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Vehicle not found' }); 
    }

    res.json(data);
  } catch (err) {
    console.error('Error al obtener el vehículo:', err);
    res.status(500).send('Error al obtener el vehículo');
  }
});


// Editar vehiculo
app.put('/vehiculos/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;
  const { estado_vehiculo, kilometraje } = req.body;

  const vehiculoId = parseInt(id_vehiculo);
  console.log('Datos recibidos:', { estado_vehiculo, kilometraje });
  try {
    const { data, error } = await supabase.from('vehiculo').update({ estado_vehiculo, kilometraje }).eq('id_vehiculo', vehiculoId);
    if (error) {
      console.error('Error al actualizar el vehículo:', error.message);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al actualizar el vehículo:', err);
    res.status(500).send('Error al actualizar el vehículo');
  }
});

//Eliminar vehiculos
app.delete('/deletevehiculo/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;
  try {
    const { data, error } = await supabase.from('vehiculo').delete().eq('id_vehiculo', id_vehiculo);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ message: 'Vehículo eliminado correctamente' }); 
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el vehículo' });
  }
});



//GESTION DE USUARIOS

// Login
app.post('/login', async (req, res) => {
  const { email, contrasenia } = req.body;

  try {
    const { data, error } = await supabase.from('usuario').select('email, contrasenia, rol').eq('email', email).single();
    if (error || !data) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (data.contrasenia !== contrasenia) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    if (data.rol !== 'secretario') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los secretarios pueden acceder.' });
    }
    res.status(200).json({ message: 'Login exitoso', rol: data.rol });

  } catch (err) {
    console.error('Error al intentar iniciar sesión:', err);
    res.status(500).send('Error al intentar iniciar sesión');
  }
});

//Agregar usuarios
app.post('/registro', async (req, res) => {
  const { nombre, apellido, email, contrasenia, rol, compania } = req.body;

  try {
    const { data, error } = await supabase.from('usuario').insert([{ nombre, apellido, email, contrasenia, rol, compania }]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Registro exitoso', data });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).send('Error al registrar el usuario');
  }
});

//Obtener datos de los usuarios

app.get('/usuarios', async (req, res) => {
  try {
    const { data, error } = await supabase.from('usuario').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).send('Error al obtener los usuarios');
  }
});

//Obtener datos de los usuarios por id
app.get('/usuarios/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const { data, error } = await supabase.from('usuario').select('*').eq('id_usuario', id_usuario).single();
    if (error) {
      return res.status(404).json({ error: 'Usuario no encontrado' }); 
    }
    res.json(data);
  } catch (err) {
    console.error('Error al obtener el usuario:', err);
    res.status(500).send('Error al obtener el usuario');
  }
});

// Editar usuario por id
app.put('/usuarios/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, apellido, email, contrasenia, rol, compania } = req.body;
  try {
    const { data, error } = await supabase.from('usuario').update({ nombre, apellido, email, contrasenia, rol, compania }).eq('id_usuario', id_usuario);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).send('Error al actualizar el usuario');
  }
});

//Eliminar usuario

app.delete('/deleteuser/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  console.log('ID de usuario recibido:', id_usuario);
  const idNum = Number(id_usuario);
  if (isNaN(idNum)) {
    return res.status(400).json({ error: 'ID de usuario no válido' });
  }
  try {
    const { data, error } = await supabase.from('usuario').delete().eq('id_usuario', idNum); 
    console.log('Data:', data);
    console.log('Error:', error);
    if (error) {
      console.error('Error al eliminar el usuario:', error);
      return res.status(500).json({ error: error.message });
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(200).json({ message: 'Usuario eliminado correctamente' });  
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
