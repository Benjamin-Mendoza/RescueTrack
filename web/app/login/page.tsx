"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { MailIcon } from './mailIcon';
import { EyeFilledIcon } from "./eyeFilledIcon";
import { EyeSlashFilledIcon } from "./eyeSlashFilledIcon";
import { useRouter } from 'next/navigation';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasenia: password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token); 
          }
          router.replace('/home');
        } else {
          setErrorMessage('Token no encontrado.');
        }
      } else {
        setErrorMessage(data.error || 'Error en el login');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor.');
      console.error('Error en la petición:', error);
    }
  };
  
  
  return (
    <div className="c1">
      <div className="c2">
        <h2 className="titulo">Login</h2>
        <span className='text-red-500 font-bold '>Rescue<span className="text-black">Track</span></span>

        <div className="form">
          {errorMessage && (
            <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>
              {errorMessage}
            </p>
          )}
          <div className="input">
            <Input
              type="email"
              label="Email"
              placeholder="Correo"
              labelPlacement="outside"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
          <div className="input">
            <Input
              label="Contraseña"
              placeholder="*******"
              labelPlacement="outside"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
          </div>

          <div>
            <Button className="button" onPress={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

