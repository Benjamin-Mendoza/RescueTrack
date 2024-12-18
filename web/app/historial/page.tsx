'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import './historial.css';
import Swal from 'sweetalert2';

interface Historial {
  cantidad: number;
  insumo: {
    nombre: string;
    cantidad: number;
    costo_unitario: number;
    costo_historico: number;
    proveedor: {
      nombre: string;
      contacto: string;
      tipo_servicio: string;
      direccion: string;
      telefono: string;
      email: string;
    };
  };
  mantencion: {
    tipo_mantencion: string;
    fecha_mantencion: string;
    descripcion: string;
    costo: number;
    estado_mantencion: string;
    vehiculo: {
      patente: string;
      id_compania: number;
    };
  };
}


export default function HistorialMantenciones() {
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHistorial = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/historial`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
          } else {
            throw new Error('Error al obtener el historial de mantenciones');
          }
        }

        const data: Historial[] = await response.json();
        setHistorial(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido al obtener el historial de mantenciones');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [router]);

  const exportToExcel = () => {
    Swal.fire({
      title: 'Exportar a Excel',
      text: 'Ingrese el trimestre que desea exportar (T1, T2, T3 o T4):',
      input: 'text',
      inputPlaceholder: 'Ejemplo: T1',
      showCancelButton: true,
      confirmButtonColor: '#154780',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !['T1', 'T2', 'T3', 'T4'].includes(value.toUpperCase())) {
          return 'Por favor, ingrese un trimestre válido (T1, T2, T3 o T4)';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const trimester = result.value.toUpperCase();
  
        const filteredHistorial = historial.filter((item) => {
          const month = new Date(item.mantencion.fecha_mantencion).getMonth() + 1;
          if (trimester === 'T1') return month >= 1 && month <= 3;
          if (trimester === 'T2') return month >= 4 && month <= 6;
          if (trimester === 'T3') return month >= 7 && month <= 9;
          if (trimester === 'T4') return month >= 10 && month <= 12;
        });
  
        if (filteredHistorial.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: `No hay datos para el trimestre ${trimester}.`,
            iconColor: '#154780',
            confirmButtonColor: '#154780',
          });
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(filteredHistorial.map(item => ({
          'Patente': item.mantencion.vehiculo.patente,
          'Tipo de Mantención': item.mantencion.tipo_mantencion,
          'Fecha Mantención': item.mantencion.fecha_mantencion,
          'Descripción': item.mantencion.descripcion,
          'Costo': item.mantencion.costo,
          'Estado': item.mantencion.estado_mantencion,
          'Insumo': item.insumo.nombre,
          'Cantidad': item.cantidad,
          'Costo Unitario': item.insumo.costo_unitario,
          'Costo Histórico': item.insumo.costo_historico,
          'Proveedor': item.insumo.proveedor.nombre,
          'Nombre': item.insumo.proveedor.contacto,
          'Tipo de Servicio': item.insumo.proveedor.tipo_servicio,
          'Dirección': item.insumo.proveedor.direccion,
          'Teléfono': item.insumo.proveedor.telefono,
          'Email': item.insumo.proveedor.email
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Historial_Trimestre_${trimester}`);
        XLSX.writeFile(workbook, `historial_mantenciones_trimestre_${trimester}.xlsx`);
  
        Swal.fire({
          icon: 'success',
          title: 'Exportación exitosa',
          text: `El historial del trimestre ${trimester} ha sido exportado correctamente.`,
          confirmButtonColor: '#154780',
        });
      }
    });
  };
  
  if (loading) return <p>Cargando historial...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <button onClick={exportToExcel} className="export-button">Exportar a Excel</button>
      <ul>
        {historial.map((item, index) => (
          <li key={index} className="card">
            <div className="card-title">Patente: {item.mantencion?.vehiculo?.patente || 'No disponible'}</div>
            <table>
              <tbody>
                <tr>
                  <th>Tipo de Mantención</th>
                  <td>{item.mantencion?.tipo_mantencion || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Fecha Mantención</th>
                  <td>{item.mantencion?.fecha_mantencion || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Descripción</th>
                  <td>{item.mantencion?.descripcion || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Costo</th>
                  <td>${item.mantencion?.costo || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Estado</th>
                  <td>{item.mantencion?.estado_mantencion || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Insumo</th>
                  <td>{item.insumo.nombre || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Cantidad</th>
                  <td>{item.cantidad || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Costo Unitario</th>
                  <td>${item.insumo.costo_unitario?.toFixed(2) || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Costo Histórico</th>
                  <td>${item.insumo.costo_historico?.toFixed(2) || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Proveedor</th>
                  <td>{item.insumo.proveedor?.nombre || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Nombre</th>
                  <td>{item.insumo.proveedor?.contacto || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Tipo de Servicio</th>
                  <td>{item.insumo.proveedor?.tipo_servicio || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Dirección</th>
                  <td>{item.insumo.proveedor?.direccion || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Teléfono</th>
                  <td>{item.insumo.proveedor?.telefono || 'No disponible'}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{item.insumo.proveedor?.email || 'No disponible'}</td>
                </tr>
              </tbody>
            </table>
          </li>
        ))}
      </ul>
    </div>
  );
}
