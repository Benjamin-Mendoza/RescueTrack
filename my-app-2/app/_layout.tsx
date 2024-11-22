import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Carga inicial de sesión
  const [isReady, setIsReady] = useState(false); // Control del montaje del componente

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isReady) return; // No realizar navegación si RootLayout no está listo

        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.id) {
            router.replace('/'); // Redirige al home si hay sesión
            return;
          }
        }
        router.replace('/login'); // Redirige al login si no hay sesión
      } catch (error) {
        console.error('Error verificando la sesión:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isReady]); // Se ejecuta solo después de que el componente esté montado

  useEffect(() => {
    setIsReady(true); // Marca que el RootLayout está montado
  }, []);

  // Indicador de carga mientras se verifica la sesión
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
