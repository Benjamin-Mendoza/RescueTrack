import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import EditScreenInfo from '@/components/EditScreenInfo';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a nuestra aplicación!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', 
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', 
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666', 
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
