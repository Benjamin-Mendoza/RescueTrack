import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import './login.css';

export default function Login() {
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
            />
          </div>
          <div className="input">
            <Input
              type="password"
              label="Contraseña"
              placeholder="Contraseña"
              labelPlacement="outside"
              fullWidth
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
