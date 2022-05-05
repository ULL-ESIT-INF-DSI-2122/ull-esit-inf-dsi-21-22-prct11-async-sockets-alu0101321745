import * as net from 'net';
import {spawn} from 'child_process';

/**
 * Clase que establece un servidor que puede recibir clientes y llevará a cabo comandos Unix.
 * @param portNumber : Puerto asociado al servidor.
 */
export class Servidor {
  constructor(protected portNumber: number) {
    const servidor = net.createServer({allowHalfOpen: true}, (connection) => {
      console.log('Cliente conectado.');
      let comando = '';
      connection.on('data', (data) => {
        comando += data;
      });

      connection.on('error', (err) => {
        if (err) {
          console.log(`Error de conexión.`);
        }
      });

      connection.on('close', () => {
        console.log('Cliente desconectado.');
      });

      connection.on('end', () => {
        console.log('Peticion recibida.');

        const solicitud = JSON.parse(comando);
        const command = spawn(solicitud.comando, solicitud.argumentos);

        let salida = '';
        command.stdout.on('data', (receive) => {
          salida += receive;
        });

        command.on('close', (peticion) => {
          if (peticion == 0) {
              connection.write(`Salida del comando: \n${salida}.\n`, () => {
              connection.end();
            });
          } else {
              connection.write(`Error, el comando ha fallado.\n`, () => {
              connection.end();
            });
          }
        });
      });
    });

    servidor.listen(this.portNumber, () => {
      console.log('Esperando a que se conecte el cliente.');
    });
  }
}

const servidor = new Servidor(60300);
