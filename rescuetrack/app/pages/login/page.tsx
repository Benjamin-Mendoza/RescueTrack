import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function Login() {
  return (
    <div className='text-left font-bold'>
      <span className='text-red-400'>Rescue</span>Track

    <div className='flex flex-col items-center justify-center h-screen text-left font-bold bg-gray-100'>
      <div className="grid grid-rows-3 grid-flow-col gap-4 pt-20 font-[family-name:var(--font-geist-sans)]">
        <div className="row-span-2 col-span-2 flex flex-col gap-4 items-center">
          {/* Recuadro para el formulario */}
          <div className="border border-red-400 rounded-lg p-8 shadow-lg bg-white">
            <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">Iniciar Sesión</h2>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex w-full flex-wrap mb-6 gap-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="example@example.com"
                  labelPlacement="outside"
                  color="primary"
                />
              </div>
              <div className="flex w-full flex-wrap mb-6 gap-4">
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="*****"
                  labelPlacement="outside"
                  color="primary"
                />
              </div>
            </div>

            <div className="flex flex-row items-center justify-center mt-4">
              <Button radius="full" color="primary" className="w-full">
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
