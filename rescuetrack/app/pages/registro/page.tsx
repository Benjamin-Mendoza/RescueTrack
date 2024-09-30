import { Button } from "@nextui-org/button";

const Registro = () => {

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Usuario</h1>
      <form className="space-y-4">

        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
          <input type="text" name="nombre" id="nombre" className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label>
          <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
          <input type="password" name="contrasena" id="contrasena" className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>

        <Button type="submit" radius="full" color="primary">Registrarse</Button>
        
      </form>
    </div>
  );
};
export default Registro;


