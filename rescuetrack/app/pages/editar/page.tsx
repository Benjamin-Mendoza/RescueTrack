import {Input} from "@nextui-org/input";
import carro from '@/app/assets/img/carro.png'
import { Button } from "@nextui-org/button";


export default function App() {
  return (

    <div className='text-left font-bold'>
      <span className='text-red-400'>Rescue</span>Track
      
    <div className="grid grid-rows-3 grid-flow-col gap-4 pt-20 font-[family-name:var(--font-geist-sans)]">

      <div className="row-span-3">
        
          <img src={carro.src} style={{ display: 'block', margin: '0 auto', maxHeight: '70%'}}/>
        
      </div>

      <div className="row-span-2 col-span-2 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              type="text"
              label="Nombre"
              placeholder="."
              labelPlacement="outside"
              
            />
            
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              type="text"
              label="Marca"
              placeholder="."
              labelPlacement="outside"
            />

            <Input
              type="text"
              label="Año"
              placeholder="."
              labelPlacement="outside"
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              type="text"
              label="Modelo"
              placeholder="."
              labelPlacement="outside"
            />
            
            <Input
              type="number"
              label="Kilometraje"
              placeholder="."
              labelPlacement="outside"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">Km</span>
                </div>
              }
            />
          </div>
        </div>
          <div className="flex flex-row items-center">
            <div className="mr-5">
              <Button radius="full">
                Atrás
              </Button>
            </div>
            <div>
              <Button radius="full" color="primary">
                Guardar
              </Button>
            </div>
          </div> 
      </div>
    </div>
    </div>
  );
}

    