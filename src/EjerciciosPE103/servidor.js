"use strict";
exports.__esModule = true;
exports.Servidor = void 0;
var net = require("net");
var child_process_1 = require("child_process");
/**
 * Clase que establece un servidor que puede recibir clientes y llevará a cabo comandos Unix.
 * @param portNumber : Puerto asociado al servidor.
 */
var Servidor = /** @class */ (function () {
    function Servidor(portNumber) {
        this.portNumber = portNumber;
        var servidor = net.createServer({ allowHalfOpen: true }, function (connection) {
            console.log('Cliente conectado.');
            var comando = '';
            connection.on('data', function (data) {
                comando += data;
            });
            connection.on('error', function (err) {
                if (err) {
                    console.log("Error de conexi\u00F3n.");
                }
            });
            connection.on('close', function () {
                console.log('Cliente desconectado.');
            });
            connection.on('end', function () {
                console.log('Peticion recibida.');
                var solicitud = JSON.parse(comando);
                var command = (0, child_process_1.spawn)(solicitud.comando, solicitud.argumentos);
                var salida = '';
                command.stdout.on('data', function (receive) {
                    salida += receive;
                });
                command.on('close', function (peticion) {
                    if (peticion == 0) {
                        connection.write("Salida del comando: \n".concat(salida, ".\n"), function () {
                            connection.end();
                        });
                    }
                    else {
                        connection.write("Error, el comando ha fallado.\n", function () {
                            connection.end();
                        });
                    }
                });
            });
        });
        servidor.listen(this.portNumber, function () {
            console.log('Esperando a que se conecte el cliente.');
            servidor.emit('Wait', ['waiting']);
        });
    }
    return Servidor;
}());
exports.Servidor = Servidor;
var servidor = new Servidor(60300);
