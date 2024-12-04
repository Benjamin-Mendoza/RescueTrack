"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler} from "chart.js";
import './dashboard.css';
import { useRouter } from "next/navigation";
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Costo {
  trimestre: number;
  total_costo: number;
}

interface VehiculoEstado {
  estado_vehiculo: "Activo" | "Inactivo";
  total_vehiculos: number;
}

interface MantencionEstado {
  estado_mantencion: "Pendiente" | "Completada";
  total_vehiculos: number;
}

const Dashboard = () => {
  const [costos, setCostos] = useState<Costo[] | null>(null);
  const [vehiculosEstado, setVehiculosEstado] = useState<VehiculoEstado[] | null>(null);
  const [mantenciones, setMantenciones] = useState<MantencionEstado[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        router.push("/login");
        return;
      }
      try {
        const resCostos = await fetch("http://localhost:8081/costostrimestre", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataCostos = await resCostos.json();
        if (Array.isArray(dataCostos)) {
          setCostos(dataCostos);
        }
        const resVehiculos = await fetch(
          "http://localhost:8081/vehiculosestado",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataVehiculos = await resVehiculos.json();
        setVehiculosEstado(dataVehiculos);

        const resMantenciones = await fetch(
          "http://localhost:8081/estadosmantencion",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataMantenciones = await resMantenciones.json();
        setMantenciones(dataMantenciones);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [router]);

  if (!costos || !vehiculosEstado || !mantenciones)
    return <p>Cargando datos...</p>;

  const trimestresMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  costos.forEach(({ trimestre, total_costo }) => {
    trimestresMap[trimestre] = total_costo;
  });
  const costosData = {
    labels: ["T1", "T2", "T3", "T4"],
    datasets: [
      {
        label: "Costos Totales por Trimestre",
        data: [
          trimestresMap[1],
          trimestresMap[2],
          trimestresMap[3],
          trimestresMap[4],
        ],
        borderColor: "#0066cc", 
        backgroundColor: "rgba(0, 102, 204, 0.2)",
        fill: true,
      },
    ],
  };

  const vehiculosMap: Record<string, number> = { Activo: 0, Inactivo: 0 };
  vehiculosEstado.forEach(({ estado_vehiculo, total_vehiculos }) => {
    vehiculosMap[estado_vehiculo] = total_vehiculos;
  });

  const vehiculosData = {
    labels: ["Activo", "Inactivo"],
    datasets: [
      {
        label: "Estado de Vehículos",
        data: [vehiculosMap["Activo"], vehiculosMap["Inactivo"]],
        backgroundColor: ["#0066cc", "#80b3ff"],
      },
    ],
  };

  const mantencionesMap: Record<string, number> = { Pendiente: 0, Completada: 0 };
  mantenciones.forEach(({ estado_mantencion, total_vehiculos }) => {
    mantencionesMap[estado_mantencion] = total_vehiculos;
  });
  const mantencionesData = {
    labels: ["Pendientes", "Completadas"],
    datasets: [
      {
        label: "Estado de Mantenciones",
        data: [mantencionesMap["Pendiente"], mantencionesMap["Completada"]],
        backgroundColor: ["#0066cc", "#80b3ff"], 
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="charts-container">
      <div className="chart-card">
          <h3>Estado de Mantenciones</h3>
          <Bar data={mantencionesData} />
        </div>

        <div className="chart-card">
          <h3>Estado de Vehículos</h3>
          <Bar data={vehiculosData} />
        </div>

        <div className="chart-card full-width">
          <h3>Costos por Trimestre</h3>
          <Line data={costosData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
