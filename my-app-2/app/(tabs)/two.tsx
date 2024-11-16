import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { supabase } from '@/app/supabaseClient';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';

interface Company {
  id_compania: number;
  nombre: string;
}

interface Vehicle {
  id_vehiculo: number;
  patente: string;
  marca: string;
  tipo_vehiculo: string;
  estado_vehiculo: string;
  compania: Company | null;
  kilometraje: number;
}


interface Maintenance {
  id_mantencion: number;
  id_vehiculo: number;
  tipo_mantencion: string;
  fecha_mantencion: string;
  descripcion: string;
  costo: number;
  estado_mantencion: string;
  horas_trabajo: number;
}

export default function TabTwoScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMaintenanceModalVisible, setEditMaintenanceModalVisible] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState<Maintenance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addMaintenanceModalVisible, setAddMaintenanceModalVisible] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState<Maintenance | null>(null);

const handleAddMaintenance = () => {
  setNewMaintenance({
    id_mantencion: 0,
    id_vehiculo: selectedVehicle?.id_vehiculo || 0,
    tipo_mantencion: '',
    fecha_mantencion: '',
    descripcion: '',
    costo: 0,
    estado_mantencion: '',
    horas_trabajo: 0,
  });
  setAddMaintenanceModalVisible(true); // Abre el modal para agregar mantenimiento
};

const closeAddMaintenanceModal = () => {
  setAddMaintenanceModalVisible(false);
  setNewMaintenance(null);
};

const saveNewMaintenance = async () => {
  if (!newMaintenance || !selectedVehicle) return;

  const { error } = await supabase.from('mantencion').insert([
    {
      id_vehiculo: selectedVehicle.id_vehiculo,
      tipo_mantencion: newMaintenance.tipo_mantencion,
      fecha_mantencion: newMaintenance.fecha_mantencion,
      descripcion: newMaintenance.descripcion,
      costo: newMaintenance.costo,
      estado_mantencion: newMaintenance.estado_mantencion,
      horas_trabajo: newMaintenance.horas_trabajo,
    },
  ]);

  if (error) {
    console.error('Error adding maintenance:', error);
  } else {
    fetchMaintenances(selectedVehicle.id_vehiculo); // Refresca la lista de mantenciones
    closeAddMaintenanceModal(); // Cierra el modal
  }
};


  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehiculo')
        .select('id_vehiculo, patente, marca, tipo_vehiculo, estado_vehiculo, kilometraje, compania(id_compania, nombre)'); // Incluye el nombre de la compañía
  
      if (error) {
        console.error('Error fetching vehicles:', error);
      } else {
        setVehicles(data || []);
        setFilteredVehicles(data || []);
      }
    };
  
    fetchVehicles();
  }, []);
  

  // Función para filtrar los vehículos
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const filtered = vehicles.filter(vehicle =>
      vehicle.patente.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  const fetchMaintenances = async (vehicleId: number) => {
    const { data, error } = await supabase
      .from<Maintenance>('mantencion')
      .select('*')
      .eq('id_vehiculo', vehicleId);

    if (error) {
      console.error('Error fetching maintenances:', error);
    } else {
      setMaintenances(data || []);
    }
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    fetchMaintenances(vehicle.id_vehiculo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVehicle(null);
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    if (maintenance.estado_mantencion === 'Pendiente') {
      setCurrentMaintenance(maintenance);
      setEditMaintenanceModalVisible(true);
    } else {
      Alert.alert('No se puede editar', 'Solo se pueden editar las mantenciones con estado "Pendiente".');
    }
  };

  const closeEditMaintenanceModal = () => {
    setEditMaintenanceModalVisible(false);
    setCurrentMaintenance(null);
  };

  const handleInputChange = (key: keyof Maintenance, value: any) => {
    if (currentMaintenance) {
      setCurrentMaintenance((prev) => ({
        ...prev!,
        [key]: value,
      }));
    }
  };

  const saveEditedMaintenance = async () => {
    if (!currentMaintenance || !selectedVehicle) return;

    const { error } = await supabase
      .from('mantencion')
      .update({
        descripcion: currentMaintenance.descripcion,
        costo: currentMaintenance.costo,
        estado_mantencion: currentMaintenance.estado_mantencion,
        horas_trabajo: currentMaintenance.horas_trabajo,
      })
      .eq('id_mantencion', currentMaintenance.id_mantencion);

    if (error) {
      console.error('Error updating maintenance:', error);
    } else {
      fetchMaintenances(selectedVehicle.id_vehiculo); // Refresca la lista de mantenciones
      closeEditMaintenanceModal();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Vehículos</Text>

      {/* Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por patente..."
        value={searchTerm}
        onChangeText={handleSearch} 
      />

      <FlatList
        data={filteredVehicles} 
        keyExtractor={(item) => item.id_vehiculo.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleVehiclePress(item)} style={styles.vehicleContainer}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleText}>Patente: {item.patente}</Text>
              <Text style={styles.vehicleText}>Marca: {item.marca}</Text>
              <Text style={styles.vehicleText}>Tipo: {item.tipo_vehiculo}</Text>
              <Text style={styles.vehicleText}>Estado: {item.estado_vehiculo}</Text>
              <Text style={styles.vehicleText}>{item.compania?.nombre}</Text>
            </View>
            <View>
              <AntDesign name="rightcircleo" size={24} color="#868486" />
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Mantenciones de {selectedVehicle?.patente}</Text>
          <FlatList
            data={maintenances}
            keyExtractor={(item) => item.id_mantencion.toString()}
            renderItem={({ item }) => (
              <View style={styles.maintenanceContainer}>
                <Text style={styles.maintenanceText}>Tipo: {item.tipo_mantencion}</Text>
                <Text style={styles.maintenanceText}>Fecha: {new Date(item.fecha_mantencion).toLocaleDateString()}</Text>
                <Text style={styles.maintenanceText}>Descripción: {item.descripcion}</Text>
                <Text style={styles.maintenanceText}>Costo: ${item.costo}</Text>
                <Text style={styles.maintenanceText}>Estado: {item.estado_mantencion}</Text>
                <Text style={styles.maintenanceText}>Horas de Trabajo: {item.horas_trabajo}</Text>

                {/* Ícono de editar */}
                {item.estado_mantencion === 'Pendiente' && (
                  <TouchableOpacity onPress={() => handleEditMaintenance(item)} style={styles.editIconContainer}>
                    <AntDesign name="edit" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <TouchableOpacity onPress={handleAddMaintenance} style={styles.addMaintenanceButton}>
            <Text style={styles.addMaintenanceButtonText}>Agregar Nueva Mantención</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={addMaintenanceModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Agregar Nueva Mantención</Text>

          {/* Formulario para ingresar datos de la nueva mantención */}
          <TextInput
            style={styles.input}
            placeholder="Tipo de Mantención"
            value={newMaintenance?.tipo_mantencion || ''}
            onChangeText={(text) => handleInputChange('tipo_mantencion', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de Mantención (YYYY-MM-DD)"
            value={newMaintenance?.fecha_mantencion || ''}
            onChangeText={(text) => handleInputChange('fecha_mantencion', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={newMaintenance?.descripcion || ''}
            onChangeText={(text) => handleInputChange('descripcion', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Costo"
            value={newMaintenance?.costo ? newMaintenance.costo.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('costo', Number(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado"
            value={newMaintenance?.estado_mantencion || 'Completado'}
            editable= {false}
            onChangeText={(text) => handleInputChange('estado_mantencion', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Horas de Trabajo"
            value={newMaintenance?.horas_trabajo ? newMaintenance.horas_trabajo.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('horas_trabajo', Number(text))}
          />

          {/* Botón para guardar nueva mantención */}
          <TouchableOpacity onPress={saveNewMaintenance} style={styles.addMaintenanceButton}>
            <Text style={styles.addMaintenanceButtonText}>Guardar Mantención</Text>
          </TouchableOpacity>

          {/* Botón para cerrar el modal */}
          <TouchableOpacity onPress={closeAddMaintenanceModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>


      <Modal visible={editMaintenanceModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Completar Mantención</Text>
          {/* Solo permitimos editar estos campos */}
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={currentMaintenance?.descripcion || ''}
            onChangeText={(text) => handleInputChange('descripcion', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Costo"
            value={currentMaintenance?.costo ? currentMaintenance.costo.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('costo', Number(text))}
          />
          <View>
            <Text style={styles.pickerLabel}>Estado de Mantención:</Text>
            <Picker style={styles.input} selectedValue={currentMaintenance?.estado_mantencion || ''}
              onValueChange={(itemValue) => handleInputChange('estado_mantencion', itemValue)}
            >
              
              <Picker.Item label="Pendiente" value="Pendiente" />
              <Picker.Item label="Completada" value="Completada" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Horas de Trabajo"
            value={currentMaintenance?.horas_trabajo ? currentMaintenance.horas_trabajo.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('horas_trabajo', Number(text))}
          />
          <TouchableOpacity onPress={saveEditedMaintenance} style={styles.addMaintenanceButton}>
            <Text style={styles.addMaintenanceButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeEditMaintenanceModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 20,
  },
  vehicleContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  maintenanceContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fafbfd',
    borderRadius: 5,
  },
  maintenanceText: {
    fontSize: 16,
  },
  addMaintenanceButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  addMaintenanceButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
  },
  editIconContainer: {
    marginLeft: 10,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },  
});
