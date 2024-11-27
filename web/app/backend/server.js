
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 8081;


app.use(cors());
app.use(express.json());



const supabaseUrl = 'https://uzqqlqvymrbuuxdvsxfb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cXFscXZ5bXJidXV4ZHZzeGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MjUxNTMsImV4cCI6MjA0NDAwMTE1M30.LVAyh2Fr2EhUlFVqjXA2tMkNk5p1Xv2iazQADo3y49Y'; 
const supabase = createClient(supabaseUrl, supabaseKey);

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, 'yourSecretKey', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido' });
    }
    req.user = user; // Adjuntar el usuario decodificado a la solicitud
    next();
  });
}


//GESTION DE VEHICULOS

//Obtener datos de los vehiculos

app.get('/vehiculos',authenticateToken , async (req, res) => {
  try {
    const { id_compania } = req.user;
    const { data, error} = await supabase.from('vehiculo').select('*').eq('id_compania', id_compania);
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

app.get('/vehiculos/:id_vehiculo',async (req, res) => {
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

//Mantenciones 

app.get('/mantencion/:id_vehiculo', async (req, res) => {
  const { id_vehiculo } = req.params;

  if (!id_vehiculo || isNaN(Number(id_vehiculo))) {
      return res.status(400).json({ error: "ID del vehículo inválido o no proporcionado." });
  }

  try {
      const { data: mantenimientos, error } = await supabase
          .from('mantencion')
          .select('*')
          .eq('id_vehiculo', Number(id_vehiculo));

      if (error) {
          return res.status(500).json({ error: error.message });
      }

      if (!mantenimientos || mantenimientos.length === 0) {
          return res.status(404).json({ error: 'No se encontraron mantenimientos para el vehículo.' });
      }

      res.json(mantenimientos);
  } catch (err) {
      console.error('Error al obtener los mantenimientos del vehículo:', err);
      res.status(500).json({ error: 'Error al obtener los mantenimientos del vehículo' });
  }
});


// Historial mantencion

app.get('/historial', authenticateToken, async (req, res) => {
  try {
    const { id_compania } = req.user;
    const { data, error } = await supabase
      .from('insumo')
      .select(`
        nombre,
        cantidad,
        costo_unitario,
        costo_historico,
        mantencion (
          tipo_mantencion,
          fecha_mantencion,
          descripcion,
          costo,
          estado_mantencion,
          vehiculo (
            patente,
            id_compania 
          )
        ),
        proveedor (
          nombre, 
          contacto,
          tipo_servicio,
          direccion,
          telefono,
          email
        )
      `);

    if (error) {
      console.error('Error al obtener el historial con mantención:', error);
      return res.status(500).json({ error: error.message });
    }
    const filteredData = data.filter(item => item.mantencion?.vehiculo?.id_compania === id_compania);
    res.status(200).json(filteredData);
  } catch (err) {
    console.error('Error en el backend al obtener el historial:', err);
    res.status(500).send('Error en el servidor');
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
  console.log('Intentando eliminar el vehículo con ID:', id_vehiculo);

  try {
    // Verificar si el vehículo existe
    const { data: vehiculoExistente, error: errorVerificacion } = await supabase
      .from('vehiculo')
      .select('*')
      .eq('id_vehiculo', id_vehiculo)
      .single();
    if (errorVerificacion) {
      return res.status(500).json({ error: 'Error al verificar el vehículo.' });
    }
    if (!vehiculoExistente) {
      return res.status(404).json({ message: 'Vehículo no encontrado.' });
    }
    // Verificar si hay mantenimientos pendientes
    const { data: mantenciones, error: mantencionesError } = await supabase
      .from('mantencion')
      .select('estado_mantencion')
      .eq('id_vehiculo', id_vehiculo);
    if (mantencionesError) {
      return res.status(500).json({ error: 'Error al consultar mantenimientos.' });
    }
    // Revisar si alguna mantención tiene el estado 'Pendiente'
    if (mantenciones && mantenciones.some((m) => m.estado_mantencion === 'Pendiente')) {
      return res.status(400).json({
        message: 'El vehículo tiene mantenciones pendientes y no puede ser eliminado.',
      });
    }
    const { data: vehiculoEliminado, error: errorEliminacion } = await supabase
      .from('vehiculo')
      .delete()
      .eq('id_vehiculo', id_vehiculo)
      .select();

    if (errorEliminacion) {
      return res.status(500).json({ error: 'Error al eliminar el vehículo.' });
    }

    res.status(200).json({
      message: 'Vehículo eliminado correctamente.',
      eliminado: vehiculoEliminado[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

//Agregar vehiculo

app.post('/nuevo_vehiculo', async (req, res) => {
  const { patente, marca, modelo, anio, tipo_vehiculo, estado_vehiculo, kilometraje, id_compania } = req.body;
  console.log('Datos recibidos:', req.body); 

  try {
    const { data, error } = await supabase.from('usuario').insert([{ patente, marca, modelo, anio, tipo_vehiculo, estado_vehiculo, kilometraje, id_compania }]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Registro exitoso', data });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).send('Error al registrar el usuario');
  }
});



//GESTION DE USUARIOS

// Login

app.post('/login', async (req, res) => {
  const { email, contrasenia } = req.body;
  try {
      const { data, error } = await supabase
          .from('usuario')
          .select('email, contrasenia, rol, id_compania')
          .eq('email', email)
          .single();

      if (error || !data) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (data.contrasenia !== contrasenia) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      if (data.rol !== 'secretario') {
          return res.status(403).json({ error: 'Acceso denegado. Solo los secretarios pueden acceder.' });
      }

      const token = jwt.sign(
          { email: data.email, rol: data.rol, id_compania: data.id_compania },
          'yourSecretKey',
          { expiresIn: '2h' }
      );

      res.status(200).json({ message: 'Inicio de sesión exitoso', token});
  } catch (err) {
      console.error('Error al intentar iniciar sesión:', err);
      res.status(500).send('Error al intentar iniciar sesión');
  }
});

//Agregar usuarios

app.post('/registro', async (req, res) => {
  const { nombre, apellido, email, contrasenia, rol, id_compania } = req.body;
  
  console.log('Datos recibidos:', req.body); 

  try {
    const { data, error } = await supabase.from('usuario').insert([{ nombre, apellido, email, contrasenia, rol, id_compania }]);
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

app.get('/usuarios', authenticateToken, async (req, res) => {
  try {
    const { id_compania } = req.user;
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id_compania', id_compania);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).send('Error al obtener los usuarios');
  }
});

//Obtener datos de los usuarios por id
app.get('/usuarios/:id_usuario' ,async (req, res) => {
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
app.put('/usuarios/:id_usuario',authenticateToken, async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, apellido, email, contrasenia, rol, id_compania } = req.body;
  try {
    const { data, error } = await supabase.from('usuario').update({ nombre, apellido, email, contrasenia, rol, id_compania }).eq('id_usuario', id_usuario);
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

//DASHBOARD

//Costo por trimestre

app.get('/costostrimestre', authenticateToken, async (req, res) => {
  try {
    const { id_compania } = req.user;
    const { data, error } = await supabase.rpc('get_costos_trimestre', { id_compania });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los costos por trimestre:', err);
    res.status(500).send('Error al obtener los costos por trimestre');
  }
});

//Estado del vehiculo

app.get('/vehiculosestado', authenticateToken, async (req, res) => {
  try {
    const { id_compania } = req.user;
    const { data, error } = await supabase.rpc('get_vehiculos_estado', { id_compania });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los estados de los vehículos:', err);
    res.status(500).send('Error al obtener los estados de los vehículos');
  }
});

//Estado de las mantenciones
app.get('/estadosmantencion', authenticateToken, async (req, res) => {
  try {
    const { id_compania } = req.user;
    const { data, error } = await supabase.rpc('get_estados_mantencion', { id_compania });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Error al obtener los estados de mantención:', err);
    res.status(500).send('Error al obtener los estados de mantención');
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
