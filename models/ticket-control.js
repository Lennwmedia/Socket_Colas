const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimo = 0;
        this.ultimosCuatro = [];

        this.init();
    }
    
    get toJson() {
        return {
            hoy: this.hoy,
            tickets: this.tickets,
            ultimo: this.ultimo,
            ultimosCuatro: this.ultimosCuatro,
        };
    }

    init() {
        const { hoy, tickets, ultimo, ultimosCuatro} = require('../db/data.json');
        // si el dia es el mismo, devuelve los datos
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimosCuatro = ultimosCuatro;
        } else {
            // si el dia es distinto, solo gurada los datos
            this.guadarDB();
        }
    }

    guadarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    siguiente() {
        this.ultimo += 1; // incrementa el ultimo
        const ticket = new Ticket(this.ultimo, null); // crea un nuevo ticket
        this.tickets.push(ticket); // agrega el ticket al arreglo
        this.guadarDB();
        return 'Ticket ' + ticket.numero;
    }
    
    atenderTicket(escritorio) {
        // si no hay tickets, devuelve null
        if (this.tickets.length === 0) {
            return null;
        }
        // si hay tickets, remove el primero y lo devuelve
        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio; // ticket independiente, se le asigna el escritorio
        this.ultimosCuatro.unshift(ticket); // mandarlo al inicio

        // si hay mas de 4 tickets, devuelve el ultimo
        if (this.ultimosCuatro.length > 4) {
            this.ultimosCuatro.splice(-1,1); // elimina el ultimo
        }

        this.guadarDB();

        return ticket;
    }

}

module.exports = TicketControl;