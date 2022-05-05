"use strict";
exports.__esModule = true;
var net = require("net");
/**
 * Clase que establece una conexion cliente con el servidor indicandole el puerto y los argumentos para llevar a cabo un comando Unix.
 * @param portNumber : Puerto asociado al servidor.
 * @param argv : Argumentos pasados por consola que tendrán el comando Unix y sus posibles opciones.
 */
var Cliente = /** @class */ (function () {
    function Cliente(portNumber, argv) {
        this.portNumber = portNumber;
        this.argv = argv;
        if (argv.length < 3) {
            console.log('Se debe especificar un comando');
        }
        else {
            var cliente_1 = net.connect({ port: portNumber });
            console.log("Comienzo de la conexi\u00F3n.");
            var peticion = {
                comando: process.argv[2],
                argumentos: process.argv.splice(3)
            };
            cliente_1.write(JSON.stringify(peticion), function () {
                cliente_1.end(function () {
                    cliente_1.emit('Comando recibido');
                });
            });
            var data_1 = '';
            cliente_1.on('data', function (receive) {
                data_1 += receive;
            });
            cliente_1.on('end', function () {
                console.log("Fin de la conexi\u00F3n.");
                console.log(data_1);
            });
            cliente_1.on('error', function (err) {
                console.log("Error de conexion.");
            });
        }
    }
    return Cliente;
}());
var cliente = new Cliente(60300, process.argv);
