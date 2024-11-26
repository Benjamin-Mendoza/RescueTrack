import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/app/supabaseClient';
import AntDesign from '@expo/vector-icons/AntDesign';

interface Notificacion {
  id_notificacion: number;
  id_vehiculo: number;
  tipo_notificacion: string;
  mensaje: string;
  fecha_notificacion: string;
  estado_notificacion: 'Pendiente' | 'Vista';
  patente?: string;
}

// Función para obtener todas las notificaciones
const obtenerNotificaciones = async (): Promise<Notificacion[]> => {
  const { data, error } = await supabase
    .from('notificacion')
    .select('*, vehiculo(patente)')
    .order('fecha_notificacion', { ascending: false });

  if (error) {
    console.error('Error al obtener las notificaciones:', error);
    return [];
  }

  // Asignar la patente a cada notificación
  const notificacionesConPatente = data?.map((notificacion) => ({
    ...notificacion,
    patente: notificacion.vehiculo?.patente, // Obtener la patente
  })) ?? [];

  return notificacionesConPatente;
};

// Función para marcar una notificación como leída
const marcarComoLeida = async (idNotificacion: number) => {
  const { error } = await supabase
    .from('notificacion')
    .update({ estado_notificacion: 'Vista' })
    .eq('id_notificacion', idNotificacion);

  if (error) {
    console.error('Error al marcar la notificación como leída:', error);
  }
};

export default function ModalScreen() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [actuales, setActuales] = useState<Notificacion[]>([]);
  const [semanaPasada, setSemanaPasada] = useState<Notificacion[]>([]);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      const data = await obtenerNotificaciones();
      setNotificaciones(data);

      // Separar las notificaciones en dos categorías
      const actuales = data.filter((notificacion) => notificacion.estado_notificacion === 'Pendiente');
      const semanaPasada = data.filter((notificacion) => notificacion.estado_notificacion === 'Vista');
      setActuales(actuales);
      setSemanaPasada(semanaPasada);
    };

    fetchNotificaciones();
  }, []); 

  // Función que actualiza la lista después de marcar una notificación como leída
  const handleMarkAsRead = async (idNotificacion: number) => {
    await marcarComoLeida(idNotificacion); // Marca la notificación como leída en la base de datos

    // Actualiza el estado local después de marcarla
    setNotificaciones((prevNotificaciones) =>
      prevNotificaciones.map((notificacion) =>
        notificacion.id_notificacion === idNotificacion
          ? { ...notificacion, estado_notificacion: 'Vista' }
          : notificacion
      )
    );

    // Filtra las notificaciones actuales y semana pasada nuevamente
    const actuales = notificaciones.filter((notificacion) => notificacion.estado_notificacion === 'Pendiente');
    const semanaPasada = notificaciones.filter((notificacion) => notificacion.estado_notificacion === 'Vista');
    setActuales(actuales);
    setSemanaPasada(semanaPasada);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centro de Notificaciones</Text>

      {/* Sección de Notificaciones Actuales */}
      <Text style={styles.sectionTitle}>Notificaciones Actuales</Text>
      {actuales.length > 0 ? (
        actuales.map((notificacion) => (
          <View key={notificacion.id_notificacion} style={styles.notification}>
            <Text>{notificacion.mensaje}</Text>
            <Text style={styles.date}>{new Date(notificacion.fecha_notificacion).toLocaleString()}</Text>
            {notificacion.estado_notificacion === 'Pendiente' && (
              <View style={styles.iconContainer}>
                <AntDesign 
                  name="check" 
                  size={30} 
                  color="#6EC207" 
                  onPress={() => handleMarkAsRead(notificacion.id_notificacion)} 
                />
              </View>
            )}
          </View>
        ))
      ) : (
        <Text>No hay notificaciones</Text>
      )}

      {/* Sección de Notificaciones Anteriores */}
      <Text style={styles.sectionTitle}>Notificaciones anteriores</Text>
      {semanaPasada.length > 0 ? (
        semanaPasada.map((notificacion) => (
          <View key={notificacion.id_notificacion} style={styles.notification}>
            <Text>{notificacion.mensaje}</Text>
            <Text style={styles.date}>{new Date(notificacion.fecha_notificacion).toLocaleString()}</Text>
          </View>
        ))
      ) : (
        <Text>No hay notificaciones</Text>
      )}

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  notification: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  date: {
    fontSize: 12,
    color: '#555',
  },
  iconContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});
