
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

//Gestion de vehiculos
app.get('/vehiculos', async (req, res) => {
  try {
    const { data, error } = await supabase.from('vehiculo').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).send('Error al obtener los vehículos');
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

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
