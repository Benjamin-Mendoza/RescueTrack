import React, { useState, useEffect } from 'react';
import { Button, View, Alert, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/app/supabaseClient';
import Ionicons from '@expo/vector-icons/Ionicons';

const ScheduleMaintenanceButton = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [patente, setPatente] = useState('');
  const [tipoMantencion, setTipoMantencion] = useState('');

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos de notificación no otorgados');
      }
    };
    requestPermissions();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const scheduleMaintenance = async () => {
    if (!date || !patente || !tipoMantencion) {
      Alert.alert('Por favor, completa todos los campos y selecciona una fecha para la mantención.');
      return;
    }

    try {
      const { data: vehiculoData, error: vehiculoError } = await supabase
        .from('vehiculo')
        .select('id_vehiculo, patente')
        .eq('patente', patente)
        .single();

      if (vehiculoError || !vehiculoData) {
        throw new Error('Vehículo no encontrado con la patente proporcionada.');
      }

      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('mantencion')
        .insert([
          {
            id_vehiculo: vehiculoData.id_vehiculo,
            tipo_mantencion: tipoMantencion,
            fecha_mantencion: date.toISOString(),
            estado_mantencion: 'Pendiente',
          },
        ]);

      if (maintenanceError) {
        throw new Error(maintenanceError.message);
      }

      const notificationDate = new Date(date);
      notificationDate.setDate(notificationDate.getDate() - 1);
      notificationDate.setHours(9, 0, 0, 0);

      const patenteVehiculo = vehiculoData.patente;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de Mantención',
          body: `Recuerda que tienes una mantención programada para el día ${date.toISOString().split('T')[0]} para el vehículo con patente ${patenteVehiculo}`,
        },
        trigger: { date: notificationDate },
      });

      const { error: notificationError } = await supabase
        .from('notificacion')
        .insert([
          {
            id_vehiculo: vehiculoData.id_vehiculo,
            tipo_notificacion: 'Recordatorio de mantención',
            mensaje: `Recordatorio: Mantención programada para el día ${date.toISOString().split('T')[0]} para el vehículo con patente ${patenteVehiculo}`,
            fecha_notificacion: notificationDate.toISOString(),
            estado_notificacion: 'Pendiente',
          },
        ]);

      if (notificationError) {
        throw new Error(notificationError.message);
      }

      Alert.alert('Éxito', 'Mantención programada.');
      setPatente('');
      setTipoMantencion('');
      setDate(null);
    } catch (error) {
      console.error('Error al programar la mantención:', error);
      Alert.alert('Error', 'No se pudo programar la mantención.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Programar Mantención</Text>

        <TextInput
          placeholder="Patente del Vehículo"
          value={patente}
          onChangeText={setPatente}
          style={styles.input}
        />

        <Text style={styles.label}>Tipo de Mantención:</Text>
        <Picker
          selectedValue={tipoMantencion}
          onValueChange={(value) => setTipoMantencion(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un tipo..." value="" />
          <Picker.Item label="Correctiva" value="Correctiva" />
          <Picker.Item label="Preventiva" value="Preventiva" />
        </Picker>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date ? `Fecha: ${date.toLocaleDateString()}` : 'Seleccionar Fecha'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

      </View>
      <TouchableOpacity style={styles.scheduleButton} onPress={scheduleMaintenance}>
          <Ionicons name="checkmark-circle-outline" size={20} color="white" style={styles.icon} />
          <Text style={styles.scheduleButtonText}>Programar Mantención</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffff',
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    marginTop: 15,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});

export default ScheduleMaintenanceButton;
