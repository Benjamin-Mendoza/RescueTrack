import React, { useState, useEffect } from 'react';
import { Button, View, Alert, StyleSheet, Text, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/app/supabaseClient';

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
          <Picker.Item label="Seleccione un tipo" value="" />
          <Picker.Item label="Correctiva" value="Correctiva" />
          <Picker.Item label="Preventiva" value="Preventiva" />
        </Picker>
        <Button title="Seleccionar Fecha de Mantención" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
        <View style={styles.buttonContainer}>
          <Button title="Programar Mantención" onPress={scheduleMaintenance} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default ScheduleMaintenanceButton;
