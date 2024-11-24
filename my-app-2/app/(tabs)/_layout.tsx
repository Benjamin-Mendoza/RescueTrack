import React from 'react';
import { Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs, Link } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ee344a',
        tabBarInactiveTintColor: '#aaa', // Color para los íconos inactivos
        tabBarStyle: {
          height: 70, // Aumenta la altura del TabBar
        },
        tabBarIconStyle: {
          fontSize: 24, // Tamaño predeterminado de los íconos
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="home"
              size={focused ? 30 : 24} // Cambia el tamaño si está activo
              color={color}
            />
          ),
          headerRight: () => (
            <Link href="/notification" asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={24}
                    color="black"
                    style={{
                      marginRight: 15,
                      opacity: pressed ? 0.5 : 1,
                      transform: [{ scale: 1.2 }] 
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="car"
              size={focused ? 30 : 24} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="currency-usd"
              size={focused ? 36 : 30} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="calendar"
              size={focused ? 30 : 24} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="five"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="user"
              size={focused ? 30 : 24} 
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
