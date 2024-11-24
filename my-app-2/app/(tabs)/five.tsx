import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface User {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export default function TabFiveScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error obteniendo los datos del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      Alert.alert('Sesión Cerrada', 'Has cerrado sesión exitosamente.');
      router.replace('/login');
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
      <View style={styles.card}>

        <View>
          <View style={styles.hole}></View>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.title}>Tarjeta de Usuario</Text>
          <Text style={styles.userText}>Nombre: <Text style={styles.userValue}>{userData.nombre}</Text></Text>
          <Text style={styles.userText}>Apellido: <Text style={styles.userValue}>{userData.apellido}</Text></Text>
          <Text style={styles.userText}>Email: <Text style={styles.userValue}>{userData.email}</Text></Text>
          <Text style={styles.userText}>Rol: <Text style={styles.userValue}>{userData.rol}</Text></Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: 280,
    height: 350,
    backgroundColor: '#f4f4f4',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  hole: {
    width: 70,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#282c34', 
  },
  userInfoContainer: {
    marginTop: 40,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  userValue: {
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ee344a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 50,
  },
  logoutText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
});
