// servidor.js
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 8081;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Configurar la conexión a Oracle
async function getVehiculos(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "admin",
      password: "Rescuetrack1",
      connectionString: "(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=gb0236d89e4e402_rescue_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
    });

    // Ejecutar la consulta SQL
    const result = await connection.execute(`SELECT * FROM Vehiculo`);
    
    // Mostrar los resultados en la consola
    console.log("Datos de la tabla Vehiculo:", result.rows);

    // Enviar los datos como respuesta al frontend
    res.json(result.rows);
  } catch (err) {
    console.error("Error al ejecutar la consulta: ", err);
    res.status(500).send("Error al ejecutar la consulta");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar la conexión: ", err);
      }
    }
  }
}

// Definir la ruta para obtener los datos
app.get('/vehiculo', getVehiculos);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
