const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('asignar-escritorio', ticketControl.ultimosCuatro);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('generar-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    })

    socket.on('atender-ticket', ({escritorio}, callback ) => {

        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'No se encontró escritorio'
            })
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('asignar-escritorio', ticketControl.ultimosCuatro);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'No se encontró ticket pendiente'
            })
        } else {
            callback({
                ok: true,
                ticket
            }); 
        }
    })

}

module.exports = {
    socketController
}

