// Referencias del HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblSmall = document.querySelector('small');
const lblAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('No se puede acceder a este recurso desde el navegador');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
lblAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (tickets) => {
    lblPendientes.innerText = tickets;
})


btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, ({ok, ticket}) => {
        if (!ok) {
            lblSmall.innerText = 'Nadie';
            lblPendientes.style.display = 'none';
            return lblAlert.style.display = '';
            
        }

        lblSmall.innerText = 'Ticket ' + ticket.numero;
    })
});