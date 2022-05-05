import * as net from 'net';
/**
 * Clase que establece una conexion cliente con el servidor indicandole el puerto y los argumentos para llevar a cabo un comando Unix.
 * @param portNumber : Puerto asociado al servidor.
 * @param argv : Argumentos pasados por consola que tendrán el comando Unix y sus posibles opciones.
 */
class Cliente {
  constructor(protected portNumber: number, protected argv: string[]) {
    if (argv.length < 3) {
      console.log('Se debe especificar un comando');
    } else {
      const cliente = net.connect({port: portNumber});
      console.log(`Comienzo de la conexión.`);
      const peticion = {
        comando: process.argv[2],
        argumentos: process.argv.splice(3),
      };

      cliente.write(JSON.stringify(peticion), () => {
        cliente.end( () => {
          cliente.emit('Comando recibido');
        });
      });

      let data = '';
      cliente.on('data', (receive) => {
        data += receive;
      });

      cliente.on('end', () => {
        console.log(`Fin de la conexión.`);
        console.log(data);
      });

      cliente.on('error', (err) => {
        console.log(`Error de conexion.`);
      });
    }
  }
}

const cliente = new Cliente(60300, process.argv);
