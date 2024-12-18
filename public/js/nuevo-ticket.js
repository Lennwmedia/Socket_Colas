const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnEnviar = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    btnEnviar.disabled = false;

});

socket.on('disconnect', () => {
    
    btnEnviar.disabled = true;

});

socket.on('ultimo-ticket', ( ultimoTicket ) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimoTicket;
})

btnEnviar.addEventListener( 'click', () => {

    socket.emit('generar-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    });

});