"use client";
import { useState } from "react";
import Link from 'next/link';
import { HiMenu } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

export default function LandingPage() {
  const [menu, setmenu] = useState(false);

  const abrir = () => {
    setmenu(!menu);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-white text-black w-full fixed top-0 left-0 z-10">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="text-3xl font-extrabold">
            Rescue<span className="text-red-500">Track</span>
          </div>
          <div className="md:hidden" onClick={abrir}>
            {menu ? (
              <AiOutlineClose size={30} className="text-black" />
            ) : (
              <HiMenu size={30} className="text-black" />
            )}
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-gray-500 transition duration-300">
              Inicio
            </Link>
            <Link href="/pages/" className="hover:text-gray-500 transition duration-300">
              Registrar usuario
            </Link>
            <Link href="/pages/" className="hover:text-gray-500 transition duration-300">
              ....
            </Link>
            <Link href="/pages/" className="hover:text-gray-500 transition duration-300">
              ...
            </Link>
          </div>
        </div>
        {menu && (
          <div className="md:hidden bg-white text-black p-4 space-y-4">
            <Link href="/" className="block hover:text-gray-500">
              Inicio
            </Link>
            <Link href="/pages/registro" className="block hover:text-gray-500">
              Registrar usuario
            </Link>
            <Link href="/pages/" className="block hover:text-gray-500">
              ...
            </Link>
            <Link href="/pages/" className="block hover:text-gray-500">
              ...
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
