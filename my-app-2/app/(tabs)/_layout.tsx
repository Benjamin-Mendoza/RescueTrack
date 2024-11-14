  import React from 'react';
  import FontAwesome from '@expo/vector-icons/FontAwesome';
  import { Link, Tabs } from 'expo-router';
  import { Pressable } from 'react-native';
  import AntDesign from '@expo/vector-icons/AntDesign';

  import Colors from '@/constants/Colors';
  import { useColorScheme } from '@/components/useColorScheme';
  import { useClientOnlyValue } from '@/components/useClientOnlyValue';

  // You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
  function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }

  export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tab One',
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24}  color={color} />,
            headerRight: () => (
              <Link href="/notification" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <AntDesign name="bells" size={24} color="black" style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Tab Two',
            tabBarIcon: ({ color }) => <AntDesign name="car" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="three"
          options={{
            title: 'Tab Three',
            tabBarIcon: ({ color }) => <AntDesign name="pdffile1" size={24} color={color}/>,
          }}
        />
          <Tabs.Screen
            name="four"
            options={{
              title: 'Tab Four',
              tabBarIcon: ({ color }) => <AntDesign name="clockcircleo" size={24} color={color} />,
            }}
          />
        
      </Tabs>
    );
  }
