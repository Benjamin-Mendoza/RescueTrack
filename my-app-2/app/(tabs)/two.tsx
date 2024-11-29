import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { supabase } from '@/app/supabaseClient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';


interface Vehicle {
  id_vehiculo: number;
  patente: string;
  marca: string;
  tipo_vehiculo: string;
  estado_vehiculo: string;
  compania: string;
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
  insumos?: Insumo[];
}

interface Insumo {
  insumo: any;
  id_insumo: number;
  nombre: string;
  cantidad: number;
}

export default function TabTwoScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState<Maintenance | null>(null);
  const [addMaintenanceModalVisible, setAddMaintenanceModalVisible] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState<Maintenance | null>(null);
  const [editMaintenanceModalVisible, setEditMaintenanceModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [insumoQuantity, setInsumoQuantity] = useState<number>(1); // Cantidad del insumo
  const [addedInsumos, setAddedInsumos] = useState<any[]>([]); // Insumos agregados temporalmente
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null); // Para un solo insumo seleccionado
  const [insumos, setInsumos] = useState<Insumo[]>([]); // Para una lista de insumos

  //console.log('insumoQuantity:', insumoQuantity);
  //console.log('selectedInsumo:', selectedInsumo);
  //console.log('insumos:', insumos);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from<Vehicle>('vehiculo').select('*');
      if (error) {
        console.error('Error fetching vehicles:', error);
      } else {
        setVehicles(data || []);
        setFilteredVehicles(data || []); // Inicialmente, todos los vehículos son visibles
      }
    };

    fetchVehicles();
  }, []);


  useEffect(() => {
    const fetchInsumos = async () => {
      const { data, error } = await supabase.from('insumo').select('*');
      if (error) {
        console.error('Error fetching insumos:', error);
      } else {
        setInsumos(data || []);
      }
    };
  
    fetchInsumos();
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
    const { data: maintenances, error } = await supabase
      .from<Maintenance>('mantencion')
      .select('*')
      .eq('id_vehiculo', vehicleId);
  
    if (error) {
      console.error('Error fetching maintenances:', error);
    } else {
      const sortedMaintenances = maintenances?.sort((a, b) => 
        new Date(b.fecha_mantencion).getTime() - new Date(a.fecha_mantencion).getTime()
      );
  
      // Para cada mantenimiento, obtenemos los insumos relacionados
      for (let i = 0; i < sortedMaintenances.length; i++) {
        const { data: insumos, error: insumoError } = await supabase
          .from('mantencion_insumo')
          .select('insumo:id_insumo(nombre), cantidad')
          .eq('id_mantencion', sortedMaintenances[i].id_mantencion);

        if (insumoError) {
          console.error('Error fetching insumos:', insumoError);
        } else {
          //console.log('Insumos:', insumos); // Verifica aquí la estructura de los insumos
          sortedMaintenances[i].insumos = insumos; // Asociamos los insumos al mantenimiento
        }
      }
  
      setMaintenances(sortedMaintenances || []);
    }
  };
   

  // Función para formatear las fechas a dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Día con 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
    const year = date.getFullYear(); // Año

    return `${day}/${month}/${year}`;
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
    setAddMaintenanceModalVisible(true);
  };

  const closeAddMaintenanceModal = () => {
    setAddMaintenanceModalVisible(false);
    setNewMaintenance(null);
  };

  const saveNewMaintenance = async () => {
    if (!newMaintenance || !selectedVehicle) return;
  
    // Verificar si la fecha es válida y no vacía
    if (!newMaintenance.fecha_mantencion) {
      console.error('La fecha de mantención es obligatoria');
      return;
    }
  
    const { data, error } = await supabase.from('mantencion').insert([{
      id_vehiculo: selectedVehicle.id_vehiculo,
      tipo_mantencion: newMaintenance.tipo_mantencion,
      fecha_mantencion: newMaintenance.fecha_mantencion,
      descripcion: newMaintenance.descripcion,
      costo: newMaintenance.costo,
      estado_mantencion: newMaintenance.estado_mantencion,
      horas_trabajo: newMaintenance.horas_trabajo,
    }]).select();
  
    if (error) {
      console.error('Error adding maintenance:', error);
    } else if (data && data.length > 0) {
      const newMantencionId = data[0].id_mantencion;
  
      // Guardar insumos relacionados
      for (const insumo of addedInsumos) {
        // Verificar si el insumo ya está agregado en la tabla mantencion_insumo
        const { data: existingInsumos, error: fetchError } = await supabase
          .from('mantencion_insumo')
          .select('id_insumo')
          .eq('id_mantencion', newMantencionId)
          .eq('id_insumo', insumo.id_insumo);
  
        if (fetchError) {
          console.error('Error fetching existing insumos:', fetchError);
          continue;
        }
  
        if (existingInsumos.length > 0) {
          // Si el insumo ya está agregado, actualizar la cantidad
          const { error: updateError } = await supabase
            .from('mantencion_insumo')
            .update({ cantidad: insumo.cantidad })
            .eq('id_mantencion', newMantencionId)
            .eq('id_insumo', insumo.id_insumo);
  
          if (updateError) {
            console.error('Error updating mantencion_insumo:', updateError);
          }
        } else {
          // Si el insumo no está agregado, insertar uno nuevo
          const insumoData = await supabase
            .from('insumo')
            .select('cantidad')
            .eq('id_insumo', insumo.id_insumo)
            .single();
  
          if (insumoData?.data?.cantidad >= insumo.cantidad) {
            // Actualizar la tabla `insumo` restando la cantidad utilizada
            const { error: updateError } = await supabase
              .from('insumo')
              .update({
                cantidad: insumoData.data.cantidad - insumo.cantidad,
              })
              .eq('id_insumo', insumo.id_insumo);
  
            if (updateError) {
              console.error('Error updating insumo stock:', updateError);
            } else {
              // Insertar el insumo en la tabla de `mantencion_insumo`
              await supabase.from('mantencion_insumo').insert([{
                id_mantencion: newMantencionId,
                id_insumo: insumo.id_insumo,
                cantidad: insumo.cantidad,
              }]);
            }
          } else {
            console.error(`No hay suficiente stock de ${insumo.nombre}`);
          }
        }
      }
  
      fetchMaintenances(selectedVehicle.id_vehiculo); // Refresca la lista de mantenciones
      closeAddMaintenanceModal();
    }
  };

  


  

  const handleInputChange = (key: keyof Maintenance, value: any) => {
    if (newMaintenance) {
      setNewMaintenance((prev) => ({
        ...prev!,
        [key]: value,
      }));
    }
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setCurrentMaintenance(maintenance);
    setEditMaintenanceModalVisible(true);
  };

  const saveEditedMaintenance = async () => {
    if (!currentMaintenance || !selectedVehicle) return;

    const { error } = await supabase
      .from('mantencion')
      .update({
        tipo_mantencion: currentMaintenance.tipo_mantencion,
        fecha_mantencion: currentMaintenance.fecha_mantencion,
        descripcion: currentMaintenance.descripcion,
        costo: currentMaintenance.costo,
        estado_mantencion: currentMaintenance.estado_mantencion,
        horas_trabajo: currentMaintenance.horas_trabajo,
      })
      .eq('id_mantencion', currentMaintenance.id_mantencion);

    if (error) {
      console.error('Error editing maintenance:', error);
    } else {
      fetchMaintenances(selectedVehicle.id_vehiculo); // Refresca la lista de mantenciones
      setEditMaintenanceModalVisible(false);
    }
  };

  const closeEditMaintenanceModal = () => {
    setEditMaintenanceModalVisible(false);
    setCurrentMaintenance(null);
  };

  

  return (
   
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Vehículos</Text>

      {/* Campo de búsqueda */}
      <View style={styles.searchContainer}>
      <AntDesign name="search1" size={20} color="#aaa" style={styles.icon} />
      <TextInput
        style={styles.searchInput}
        placeholder="   Buscar por patente..."
        placeholderTextColor="#aaa"
        value={searchTerm}
        onChangeText={handleSearch}
      />
    </View>

    <FlatList
      data={filteredVehicles}
      keyExtractor={(item) => item.id_vehiculo.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleVehiclePress(item)}
          style={styles.vehicleContainer}
        >
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleText}>
              <Text style={styles.boldText}>Patente: </Text>{item.patente}
            </Text>
            <Text style={styles.vehicleText}>
              <Text style={styles.boldText}>Marca: </Text>{item.marca}
            </Text>
            <Text style={styles.vehicleText}>
              <Text style={styles.boldText}>Tipo: </Text>{item.tipo_vehiculo}
            </Text>
            <Text style={styles.vehicleText}>
              <Text style={styles.boldText}>Estado: </Text>{item.estado_vehiculo}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="caret-forward-circle-outline" size={32} color="#868486" />
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
                <Text style={styles.maintenanceText}>
                  <Text style={styles.boldText}>Tipo: </Text>{item.tipo_mantencion}
                </Text>
                <Text style={styles.maintenanceText}>
                  <Text style={styles.boldText}>Fecha: </Text>{formatDate(item.fecha_mantencion)}
                </Text>
                <Text style={styles.maintenanceText}>
                  <Text style={styles.boldText}>Descripción: </Text>{item.descripcion}
                </Text>
                <Text style={styles.maintenanceText}>
                  <Text style={styles.boldText}>Costo: </Text>${item.costo}
                </Text>
                <Text style={styles.maintenanceText}>
                  <Text style={styles.boldText}>Estado: </Text>{item.estado_mantencion}
                </Text>
                <Text style={styles.maintenanceText}>
                  <Text style={styles.boldText}>Horas de Trabajo: </Text>{item.horas_trabajo}
                </Text>
              
                {/* Mostrar los insumos si existen */}
                {item.insumos && item.insumos.length > 0 && (
                <View>
                  <Text style={styles.maintenanceText}>Insumos:</Text>
                  {item.insumos.map((insumo) => (
                    <Text key={insumo.insumo.nombre} style={styles.maintenanceText}>
                      {insumo.insumo.nombre} - Cantidad: {insumo.cantidad}
                    </Text>
                  ))}
                </View>
              )}
                {/* Ícono de editar mantencion pendiente*/}
                {item.estado_mantencion === 'Pendiente' && (
                  <TouchableOpacity onPress={() => handleEditMaintenance(item)} style={styles.editIconContainer}>
                    <Feather name="edit-2" size={24} color="black" />
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
      {/* Modal para agregar matencion */}
      <Modal visible={addMaintenanceModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Agregar Mantención</Text>
          <TextInput
            style={styles.input}
            placeholder="Tipo de Mantención"
            value={newMaintenance?.tipo_mantencion || ''}
            onChangeText={(text) => handleInputChange('tipo_mantencion', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
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
          <Picker
            selectedValue={newMaintenance?.estado_mantencion}
            onValueChange={(itemValue) =>
              handleInputChange('estado_mantencion', itemValue)
            }
            style={styles.picker}
          >
            <Picker.Item label="Completada" value="Completada" style={styles.pickerItem} />
            <Picker.Item label="Pendiente" value="Pendiente" style={styles.pickerItem} />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Horas de Trabajo"
            value={newMaintenance?.horas_trabajo ? newMaintenance.horas_trabajo.toString() : ''}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange('horas_trabajo', Number(text))}
          />
          <View style={styles.insumoContainer}>
            <Text>Agregar Insumos:</Text>
            
            <Picker
              selectedValue={selectedInsumo}
              onValueChange={(itemValue) => setSelectedInsumo(itemValue)}
            >
              <Picker.Item label="Seleccione un insumo..." value={null} />
              {insumos.map((insumo) => (
                <Picker.Item key={insumo.id_insumo} label={insumo.nombre} value={insumo} />
              ))}
            </Picker>

            <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputCantidad}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={insumoQuantity.toString()}
              onChangeText={(text) => setInsumoQuantity(Number(text))}
            />

            <TouchableOpacity
              onPress={() => {
                if (selectedInsumo) {
                  setAddedInsumos((prev) => [...prev, { ...selectedInsumo, cantidad: insumoQuantity }]);
                  setSelectedInsumo(null);
                  setInsumoQuantity(1);
                }
              }}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Agregar Insumo</Text>
            </TouchableOpacity>
          </View>

          </View>
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

          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={currentMaintenance?.descripcion}
            onChangeText={(text) => setCurrentMaintenance({ ...currentMaintenance!, descripcion: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Costo"
            value={currentMaintenance?.costo?.toString()}
            keyboardType="numeric"
            onChangeText={(text) =>
              setCurrentMaintenance({
                ...currentMaintenance!,
                costo: parseFloat(text),
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Horas de Trabajo"
            value={currentMaintenance?.horas_trabajo?.toString()}
            keyboardType="numeric"
            onChangeText={(text) =>
              setCurrentMaintenance({
                ...currentMaintenance!,
                horas_trabajo: parseFloat(text),
              })
            }
          />
          <Picker
            selectedValue={currentMaintenance?.estado_mantencion}
            onValueChange={(itemValue) =>
              setCurrentMaintenance({ ...currentMaintenance!, estado_mantencion: itemValue })
            }
          >
            <Picker.Item label="Seleccione estado..." value="" />
            <Picker.Item label="Completada" value="Completada" />
          </Picker>

          <View style={styles.insumoContainer}>
            <Picker
              selectedValue={selectedInsumo}
              onValueChange={(itemValue) => setSelectedInsumo(itemValue)}
            >
              <Picker.Item label="Seleccione un insumo..." value={null} />
              {insumos.map((insumo) => (
                <Picker.Item key={insumo.id_insumo} label={insumo.nombre} value={insumo} />
              ))}
            </Picker>

            <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputCantidad}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={insumoQuantity.toString()}
              onChangeText={(text) => setInsumoQuantity(Number(text))}
            />

            <TouchableOpacity
              onPress={() => {
                if (selectedInsumo) {
                  setAddedInsumos((prev) => [...prev, { ...selectedInsumo, cantidad: insumoQuantity }]);
                  setSelectedInsumo(null);
                  setInsumoQuantity(1);
                }
              }}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+ Agregar Insumo</Text>
            </TouchableOpacity>
          </View>
            
          
          
          <TouchableOpacity onPress={saveEditedMaintenance} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeEditMaintenanceModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginVertical: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3, 
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333', 
    paddingVertical: 0, 
  },
  icon: {
    marginRight: 10, 
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 1,
    borderRadius: 12,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5, 
  },
  boldText: {
    fontWeight: 'bold', 
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#e8e8e8',
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
    borderRadius: 8
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
  },
  editIconContainer: {
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#e4e4e4',
    borderRadius: 8,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginBottom: 15,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerItem: {
    fontSize: 16,
    color: '#555',
  },
  insumoContainer: {
    marginVertical: 20,
  },
  insumoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputCantidad: {
    flex: 1, // Asegura que el campo de entrada ocupe el máximo espacio disponible
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 10, // Espacio entre el campo de texto y el botón
    height: 40,
    borderColor: 'gray',
    paddingLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row', // Alinea los elementos horizontalmente
    alignItems: 'center', // Centra los elementos verticalmente
    justifyContent: 'space-between', // Espacio entre los elementos
    marginVertical: 8, // Espacio alrededor de la fila
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF', // Color del botón
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
