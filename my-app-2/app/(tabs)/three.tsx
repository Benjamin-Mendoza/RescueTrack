import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, Button, Alert, Pressable, TouchableOpacity } from 'react-native';
import { BarChart, LineChart  } from 'react-native-chart-kit';
import { supabase } from '@/app/supabaseClient';
import { PDFDocument, rgb } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


interface Maintenance {
  id_mantencion: number;
  id_vehiculo: number;
  tipo_mantencion: string;
  fecha_mantencion: string;
  descripcion: string;
  costo: number;
  estado_mantencion: string;
  horas_trabajo: number;
  patente: string;
}

// Función para obtener mantenciones del año actual
const fetchMaintenances = async (): Promise<Maintenance[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('mantencion')
      .select('vehiculo(patente), tipo_mantencion, descripcion, fecha_mantencion, costo')
      .gte('fecha_mantencion', `${currentYear}-01-01`)
      .lt('fecha_mantencion', `${currentYear + 1}-01-01`);

    if (error) throw new Error(error.message);

    return data.map((item: any) => ({
      ...item,
      patente: item.vehiculo.patente,
    })) as Maintenance[];
  } catch (error) {
    console.error('Error al obtener mantenciones:', error);
    throw error;
  }
};

const currentYear = new Date().getFullYear(); // Obtiene el año actual


const MaintenanceCostChart = () => {
  const [data, setData] = useState<{ trimestre: number; total_costo_trimestral: number }[]>([]);
  const [cantidadMantenimientos, setCantidadMantenimientos] = useState<number>(0);
  const [totalCosto, setTotalCosto] = useState<number>(0);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  useEffect(() => {
    const fetchQuarterlyCosts = async () => {
      const { data, error } = await supabase.rpc('obtener_costo_mantenciones_trimestrales');
      if (error) console.error('Error fetching quarterly costs:', error);
      else setData(data || []);
    };

    const fetchMaintenanceSummary = async () => {
      const year = new Date().getFullYear();

      const { data: cantidadData, error: cantidadError } = await supabase
        .from('mantencion')
        .select('*', { count: 'exact' })
        .gte('fecha_mantencion', `${year}-01-01`)
        .lte('fecha_mantencion', `${year}-12-31`)
        .eq('estado_mantencion', 'Completada');;

      if (cantidadError) console.error('Error fetching maintenance count:', cantidadError);
      else setCantidadMantenimientos(cantidadData?.length || 0);

      const { data: costoData, error: costoError } = await supabase
        .from('mantencion')
        .select('costo')
        .gte('fecha_mantencion', `${year}-01-01`)
        .lte('fecha_mantencion', `${year}-12-31`);

      if (costoError) console.error('Error fetching total cost:', costoError);
      else {
        const total = costoData.reduce((acc, curr) => acc + (curr.costo || 0), 0);
        setTotalCosto(total);
      }
    };

    const loadMaintenances = async () => {
      try {
        const data = await fetchMaintenances();
        setMaintenances(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las mantenciones.');
      }
    };

    fetchQuarterlyCosts();
    fetchMaintenanceSummary();
    loadMaintenances();
  }, []);

  const generatePDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([600, 400]);
      const { height } = page.getSize();
      const margin = 50; // Margen superior
      const lineHeight = 20; // Altura de la línea de texto
      const textSize = 9; // Tamaño de la fuente
      const maxLinesPerPage = 30; // Máximo número de líneas por página
      let currentLine = 0; // Contador de líneas actuales
  
      page.drawText(`Reporte de Mantenciones - ${currentYear}`, {
        x: margin,
        y: height - margin,
        size: 30,
        color: rgb(0, 0, 0),
      });
  
      maintenances.forEach((maintenance, index) => {
        // Si se excede el número máximo de líneas, agregar una nueva página
        if (currentLine >= maxLinesPerPage) {
          page = pdfDoc.addPage([600, 400]); // Agregar nueva página
          currentLine = 0; // Restablecer contador de líneas
        }
  
        page.drawText(
          `Patente: ${maintenance.patente} | ${maintenance.tipo_mantencion} | ${maintenance.descripcion} | ${maintenance.fecha_mantencion} | Costo: $${maintenance.costo}`,
          {
            x: margin,
            y: height - margin - (currentLine + 1) * lineHeight,
            size: textSize,
            color: rgb(0, 0, 0),
          }
        );
  
        currentLine++; // Incrementar el contador de líneas
      });
  
      const total = maintenances.reduce((acc, maintenance) => acc + maintenance.costo, 0);
      page.drawText(`Total: $${total}`, {
        x: margin,
        y: height - margin - (currentLine + 1) * lineHeight,
        size: 12,
        color: rgb(0, 0, 0),
      });
  
      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = globalThis.btoa(String.fromCharCode(...pdfBytes));
      const filePath = `${FileSystem.documentDirectory}ReporteMantenciones.pdf`;
      await FileSystem.writeAsStringAsync(filePath, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      await Sharing.shareAsync(filePath);
      Alert.alert('PDF generado y compartido con éxito!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error generando el PDF:', error);
        Alert.alert('Error generando el PDF', error.message);
      } else {
        console.error('Error generando el PDF:', error);
        Alert.alert('Error generando el PDF', 'Ocurrió un error desconocido.');
      }
    }
  };
  

  const chartData = {
    labels: data.map((item) => `Trimestre ${item.trimestre}`),
    datasets: [
      {
        data: data.map((item) => item.total_costo_trimestral),
      },
    ],
  };

  const formattedData = chartData.datasets[0].data.map((value) =>
    value >= 1000000 ? Number((value / 1000000).toFixed(1)) : value >= 1000 ? Number((value / 1).toFixed(1)) : value
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Costos</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumen de Mantenimientos</Text>
        <Text>Cantidad de Mantenimientos: {cantidadMantenimientos}</Text>
        <Text>Total Costo: ${totalCosto.toLocaleString("es-ES")}</Text>
      </View>

      <Text style={styles.title2}>Costo de Mantenciones Trimestral - {new Date().getFullYear()}</Text>
      <LineChart
        data={{
          labels: ['0', ...data.map((item, index) => `T${item.trimestre || index + 1}`)],
          datasets: [
            {
              data: [0, ...formattedData],
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={300}
        yAxisLabel="$"
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={styles.chart}
      />

        <View style={styles.buttonContainer}>
          <Text style={styles.summaryTitle}>Reporte de Mantenimientos</Text>
          <Text>Resumen de los mantenimientos del año actual</Text>
          <TouchableOpacity style={styles.reportButton} onPress={generatePDF}>
            <Text style={styles.reportButtonText}>Generar PDF</Text>
          </TouchableOpacity>
        </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff' 
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
},
  title2: { 
    fontSize: 20, 
    textAlign: 'center', 
    marginBottom: 20 
},
  chart: { 
    marginVertical: 8, 
    borderRadius: 10 
},
  summaryContainer: { 
    marginTop: 10, 
    padding: 10, 
    marginBottom: 20, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10 
},
  summaryTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
},
  reportButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
},
  reportButtonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
},
  buttonContainer: { 
    marginTop: 10, 
    padding: 10, 
    marginBottom: 20, 
    backgroundColor: '#F0F0F0', 
    borderRadius: 10,
},
});

export default MaintenanceCostChart;
