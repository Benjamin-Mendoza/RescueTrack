import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'login', // Define login como ruta inicial
};

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica si el usuario está almacenado
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser); // Asegúrate de que sea un objeto válido
          
          // Imprimir en consola para ver el contenido del usuario almacenado
          console.log('Usuario almacenado:', user);  // Aquí podrás ver la información del usuario

          if (user && user.id) {
            router.replace('/'); // Redirige al home si el usuario está autenticado
            return;
          }
        }
        router.replace('/login'); // Redirige al login si no hay usuario
      } catch (error) {
        console.error('Error verificando la sesión:', error);
        router.replace('/login');
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    checkAuth();
  }, []);

  // Mostrar un indicador de carga mientras se verifica la sesión
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Configuración de las pantallas
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
