import { Button } from "@nextui-org/button";

const Registro = () => {
  return (
    <div className="c1">
    <div className="c2">
      <h1 className="titulo">Registro de Usuario</h1>
      <form className="space-y-4">
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
          <input type="text" name="nombre" id="nombre" className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>

        <div>
          <label htmlFor="rol" className="block text-sm font-medium">Rol</label>
          <select name="rol" id="rol" className="mt-1 block w-full px-3 py-2 border rounded-md">
            <option value="">Seleccionar rol</option>
            <option value="secretario">Secretario</option>
            <option value="mecanico">Mecanico</option>
            <option value="capitan">Capitan</option>
            <option value="teniente">Teniente</option>
          </select>
        </div>

        <div>
          <label htmlFor="compania" className="block text-sm font-medium">Compañía</label>
          <select name="compania" id="compania" className="mt-1 block w-full px-3 py-2 border rounded-md">
            <option value="">Seleccionar compañía</option>
            <option value="primera">Primera Compañía</option>
            <option value="segunda">Segunda Compañía</option>
            <option value="tercera">Tercera Compañía</option>
            <option value="cuarta">Cuarta Compañía</option>
            <option value="quinta">Quinta Compañía</option>
            <option value="sexta">Sexta Compañía</option>
            <option value="septima">Septima Compañía</option>
            <option value="octava">Octava Compañía</option>
            <option value="novena">Novena Compañía</option>
            <option value="undecima">Undecima Compañía</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Correo Electrónico</label>
          <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
          <input type="password" name="contrasena" id="contrasena" className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>

        <Button className="button" type="submit" radius="full" color="primary">Registrarse</Button>
      </form>
    </div>
    </div>
  );
};
export default Registro;