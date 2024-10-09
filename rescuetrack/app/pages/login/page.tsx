"use client";
import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import {MailIcon} from './mailIcon';
import {EyeFilledIcon} from "./eyeFilledIcon";
import {EyeSlashFilledIcon} from "./eyeSlashFilledIcon";
import './login.css';

export default function Login() {

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="c1">
      <div className="c2">
        <h2 className="titulo">Login</h2>
        <span className='text-red-500 font-bold '>Rescue</span><span className="text-black">Track</span>

        <div className="form">
          <div className="input">
            <Input
              type="email"
              label="Email"
              placeholder="Correo"  
              labelPlacement="outside"
              fullWidth
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
            <Button className="button">
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
