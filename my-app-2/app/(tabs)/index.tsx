import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/app/supabaseClient';


interface Insumo {
  id_insumo: number;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
  costo_historico: number;
  id_proveedor: number;
}

interface Vehiculo {
  patente: string;
}
interface Mantencion {
  id_mantencion: number;
  id_vehiculo: number;
  tipo_mantencion: string;
  estado_mantencion: string;
  fecha_mantencion: string;
  descripcion: string;
  costo: number;
  horas_trabajo: number;
}


export default function TabOneScreen() {
  const [vehiculosActivos, setVehiculosActivos] = useState(0);
  const [vehiculosInactivos, setVehiculosInactivos] = useState(0);
  const [mantencionesPendientes, setMantencionesPendientes] = useState(0);
  const [insumos, setInsumos] = useState<Insumo[]>([]); 
  const [vehiculosConMantencionesPendientes, setVehiculosConMantencionesPendientes] = useState<Vehiculo[]>([]);

  useEffect(() => {
    // Obtener vehículos activos
    const fetchVehiculos = async () => {
      const { data: vehiculos, error } = await supabase
        .from('vehiculo')
        .select('*')
        .eq('estado_vehiculo', 'Activo');

      if (error) {
        console.error('Error al obtener vehículos activos:', error);
      } else {
        setVehiculosActivos(vehiculos.length);
      }
    };

    // Obtener vehículos inactivos
    const fetchVehiculosInactivos = async () => {
      const { data: vehiculosInactivos, error } = await supabase
        .from('vehiculo')
        .select('*')
        .eq('estado_vehiculo', 'Inactivo');

      if (error) {
        console.error('Error al obtener vehículos inactivos:', error);
      } else {
        setVehiculosInactivos(vehiculosInactivos.length);
      }
    };

    // Obtener mantenciones pendientes
    const fetchMantencionesPendientes = async () => {
      const { data: mantenciones, error } = await supabase
        .from('mantencion')
        .select('*')
        .eq('estado_mantencion', 'Pendiente');

      if (error) {
        console.error('Error al obtener mantenciones pendientes:', error);
      } else {
        setMantencionesPendientes(mantenciones.length);
      }
    };

    // Obtener lista de insumos
    const fetchInsumos = async () => {
      const { data: insumosData, error } = await supabase
        .from<Insumo>('insumo')
        .select('*');

      if (error) {
        console.error('Error al obtener insumos:', error);
      } else {
        setInsumos(insumosData);
      }
    };

    // Obtener vehículos con mantenciones pendientes
    const fetchVehiculosConMantencionesPendientes = async () => {
      const { data: mantenciones, error } = await supabase
        .from<Mantencion>('mantencion')  
        .select('id_vehiculo')
        .eq('estado_mantencion', 'Pendiente');
    
      if (error) {
        console.error('Error al obtener mantenciones pendientes:', error);
      } else {
        //console.log('Mantenciones pendientes:', mantenciones);  // Depuración
        const vehiculosIds = mantenciones.map((mantencion) => mantencion.id_vehiculo);
    
        // Aquí se obtiene el id_vehiculo, patente y estado_vehiculo para cada vehículo
        const { data: vehiculos, error: vehiculosError } = await supabase
          .from('vehiculo')
          .select('id_vehiculo, patente, estado_vehiculo')  
          .in('id_vehiculo', vehiculosIds);
    
        if (vehiculosError) {
          console.error('Error al obtener vehículos con mantenciones pendientes:', vehiculosError);
        } else {
          //console.log('Vehículos con mantenciones pendientes:', vehiculos);  // Depuración
          setVehiculosConMantencionesPendientes(vehiculos);
        }
      }
    };
    

    fetchVehiculos();
    fetchVehiculosInactivos();
    fetchMantencionesPendientes();
    fetchInsumos();
    fetchVehiculosConMantencionesPendientes();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/casco-de-bombero.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.subtitle}>Tu solución para gestionar mantenciones de vehículos.</Text>
        </View>

        <View style={styles.containerResume}>
          <View style={styles.summaryContainer}>
            <Text>🚒</Text>
            <Text style={styles.summaryTitle}>Vehículos</Text>
            <Text>Vehículos activos: {vehiculosActivos}</Text>
            <Text>Vehículos inactivos: {vehiculosInactivos}</Text>
          </View>

          <View style={styles.reportContainer}>
            <Text>🔧</Text>
            <Text style={styles.summaryTitle}>Mantenciones</Text>
            <Text>Mantenciones pendientes: {vehiculosConMantencionesPendientes.length}</Text>
            {vehiculosConMantencionesPendientes.length > 0 && (
  vehiculosConMantencionesPendientes.map((vehiculo, index) => (
    <Text key={index}>{'  •  '}Patente: {vehiculo.patente}</Text>
  ))
)}
          </View>
        </View>

        <View style={styles.inventoryContainer}>
          <Text>📦</Text>
          <Text style={styles.summaryTitle}>Insumos</Text>
          <Text>Lista de insumos en inventario:</Text>
          {insumos.map((insumo) => (
            <Text key={insumo.id_insumo}>
              {'  •  '}{insumo.nombre} - {insumo.cantidad}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff' 
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  containerResume: {
    paddingTop: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  summaryContainer: { 
    padding: 10, 
    marginBottom: 20, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10,
    width: '47%', 
    height: 150, 
    justifyContent: 'space-around', 
  },
  reportContainer: { 
    padding: 10, 
    marginBottom: 20, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10,
    width: '47%', 
    height: 150, 
    justifyContent: 'space-around', 
  },
  summaryTitle: { 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inventoryContainer: { 
    padding: 10, 
    marginBottom: 20, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10,
  },
});
