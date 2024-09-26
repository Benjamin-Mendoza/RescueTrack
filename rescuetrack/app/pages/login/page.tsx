import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import  login  from '@app/assets/img/login.png'


export default function Login() {
  return (
    
    <div className='text-left font-bold'>
      <span className='text-red-400'>Rescue</span>Track
    
    <div className='flex flex-col items-center justify-center h-screen text-left font-bold'>
      <div className="grid grid-rows-3 grid-flow-col gap-4 pt-20 font-[family-name:var(--font-geist-sans)]">
        <div className="row-span-2 col-span-2 flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
              <Input
                type="email"
                label="Email"
                placeholder="Escribe tu email"
                labelPlacement="outside"
              />
            </div>
            <div className="row-span-3">
        
          <img src={login.src} style={{ display: 'block', margin: '0 auto', maxHeight: '70%'}}/>
        
      </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
              <Input
                type="password"
                label="Contraseña"
                placeholder="Escribe tu contraseña"
                labelPlacement="outside"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-row items-center">
            <Button radius="full" color="primary">
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
