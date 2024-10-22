'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SideNav() {
  const pathname = usePathname(); // Obtener la ruta actual

  return (
    <div className="md:w-60 bg-[#003153] h-screen flex-col items-center justify-between fixed border-r border-zinc-200 hidden md:flex">
      <div className="w-full">
        
        <div className="text-center p-4 text-2xl font-bold text-red-500 border-b border-white w-full mb-6">
          Rescue<span className="text-white">Track</span>
        </div>

        
        <div className="flex flex-col items-center space-y-2">
          
          <Link
            href="/home"
            className={`p-4 text-xl font-bold ${
              pathname === '/' ? 'bg-zinc-100' : ''
            } w-full text-center text-white`}
          >
            Inicio
          </Link>

          
          <div className="w-full border-t border-white"></div>

          
          <Link
            href="/usuarioslista"
            className={`p-4 text-xl font-bold ${
              pathname === '/usuarios' ? 'bg-zinc-100' : ''
            } w-full text-center text-white`}
          >
            Usuarios
          </Link>

          
          <div className="w-full border-t border-white"></div>

          
          <Link
            href="/lista"
            className={`p-4 text-xl font-bold ${
              pathname === '/vehiculos' ? 'bg-zinc-100' : ''
            } w-full text-center text-white`}
          >
            Vehículos
          </Link>
        </div>
      </div>
    </div>
  );
}





