
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

<<<<<<< HEAD
//GESTION DE VEHICULOS

//Obtener datos de los vehiculos
app.get('/vehiculos', async (req, res) => {
  try {
=======
// Gestion de vehiculos - GET /vehiculos
app.get('/vehiculos', async (req, res) => {
  try {
    // Realiza la consulta a la tabla 'vehiculo' en Supabase
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
    const { data, error } = await supabase.from('vehiculo').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
<<<<<<< HEAD
    res.json(data);
=======
    res.json(data); // Devuelve los datos en formato JSON
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
  } catch (err) {
    console.error('Error al obtener los vehículos:', err);
    res.status(500).send('Error al obtener los vehículos');
  }
});

<<<<<<< HEAD
//Obtener datos de los vehiculos por id
app.get('/vehiculos/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;
  try {
    const { data, error } = await supabase.from('vehiculo').select('*').eq('id_vehiculo', id_vehiculo).single();
    if (error) {
      return res.status(404).json({ error: 'Vehiculo no encontrado' }); 
    }
=======
// Gestion de vehiculos por id_vehiculo
app.get('/vehiculos/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;

  try {
    const { data, error } = await supabase
      .from('vehiculo')
      .select('*')
      .eq('id_vehiculo', id_vehiculo)
      .single(); // Devuelve un solo resultado

    if (error) {
      return res.status(404).json({ error: 'Vehicle not found' }); // Cambia a 404 si no se encuentra el vehículo
    }

>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
    res.json(data);
  } catch (err) {
    console.error('Error al obtener el vehículo:', err);
    res.status(500).send('Error al obtener el vehículo');
  }
});

<<<<<<< HEAD
//Modificar datos de los vehiculos 
=======
// Editar vehiculo
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
app.put('/vehiculos/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;
  const { marca, modelo, anio } = req.body;

  try {
    const { data, error } = await supabase
      .from('vehiculo')
      .update({ marca, modelo, anio })
      .eq('id_vehiculo', id_vehiculo);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
<<<<<<< HEAD
    res.json(data);
=======
    res.json(data); // Devuelve los datos actualizados en formato JSON
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
  } catch (err) {
    console.error('Error al actualizar el vehículo:', err);
    res.status(500).send('Error al actualizar el vehículo');
  }
});

//Gestion de usuarios
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

<<<<<<< HEAD

//GESTION DE USUARIOS

//Obtener datos de los usuarios
=======
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
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

<<<<<<< HEAD
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

app.delete('/deletuser/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const { data, error } = await supabase
      .from('usuario')
      .delete()
      .eq('id_usuario', id_usuario);

    console.log('Data:', data);
    console.log('Error:', error);

    if (error) {
      console.error('Error al eliminar el usuario:', error);
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    res.status(500).send('Error al eliminar el usuario');
  }
});



=======
>>>>>>> 3a9d137fd15ffb83babafa2fc2e45830eb9b0be5
// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
