import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Define la interfaz para el usuario
interface User {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export default function TabFiveScreen() {
  const [userData, setUserData] = useState<User | null>(null); // Usamos la interfaz User
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser)); // Parsear el usuario y guardar en el estado
        }
      } catch (error) {
        console.error('Error obteniendo los datos del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los datos del usuario.');
      } finally {
        setLoading(false); // Una vez terminada la carga
      }
    };

    getUserData();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Sesión Cerrada', 'Has cerrado sesión exitosamente.');
      router.replace('/login');  // Redirige al login
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron datos del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Usuario</Text>
      <Text>Nombre: {userData.nombre}</Text>
      <Text>Apellido: {userData.apellido}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Rol: {userData.rol}</Text>

      <Button
        title="Cerrar Sesión"
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
