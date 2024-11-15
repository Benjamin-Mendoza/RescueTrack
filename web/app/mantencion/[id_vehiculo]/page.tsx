"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './mantencion.css';

interface Mantencion {
    id_mantencion: number;
    id_vehiculo: number;
    tipo_mantencion: string;
    fecha_mantencion: string;
    descripcion: string;
    costo: number;
    estado_mantencion: string;
}

async function getMantenimientos(id_vehiculo: number): Promise<Mantencion[]> {
    const res = await fetch(`http://localhost:8081/mantencion/${id_vehiculo}`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}

export default function MantencionesPage() {
    const { id_vehiculo } = useParams();  

    const [mantenimientos, setMantenimientos] = useState<Mantencion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchMantenimientos = async () => {
            if (!id_vehiculo) {
                setError("El ID del vehículo es inválido o no está presente.");
                setLoading(false);
                return;
            }

            try {
                const vehiculoId = parseInt(id_vehiculo as string, 10);
                const data = await getMantenimientos(vehiculoId);
                setMantenimientos(data);
            } catch (error) {
                setError("No se encontraron mantenimientos para este vehículo.");
            } finally {
                setLoading(false);
            }
        };

        fetchMantenimientos();
    }, [id_vehiculo]);

    const formatFechaMantencion = (fecha_mantencion: string) => new Date(fecha_mantencion).toLocaleString();

    if (loading) return <p>Cargando mantenimientos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {mantenimientos.length > 0 ? (
                <table className="mantencion-table">
                    <thead>
                        <tr>
                            <th>Tipo de Mantenimiento</th>
                            <th>Descripción</th>
                            <th>Fecha de Mantenimiento</th>
                            <th>Costo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mantenimientos.map((mantencion) => (
                            <tr key={mantencion.id_mantencion}>
                                <td>{mantencion.tipo_mantencion}</td>
                                <td>{mantencion.descripcion}</td>
                                <td>{formatFechaMantencion(mantencion.fecha_mantencion)}</td>
                                <td>{mantencion.costo}</td>
                                <td>{mantencion.estado_mantencion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se encontraron mantenimientos para este vehículo.</p>
            )}
        </div>
    );
}


