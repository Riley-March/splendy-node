const cheerio = require('cheerio');
const axios = require('axios');
const Ticket = require('../models/ticket');

const fetchData = async (url) => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

const get_camping_tickets = async (url) => {
    const $ = await fetchData(url);
    let ticket_quantity = 0;
    $('select[name=lQuantity0]').children().each((index, element) => {
        const type = element.children[0].data;
        if(type !== 'Select'){
            ticket_quantity += 1;
        }
    });
    const date = new Date();
    const ticket = new Ticket({
        type: 'Groovin_GA',
        quantity: ticket_quantity,
        timestamp: date.getTime()
    });
    await ticket.save()
    return ticket;
}

module.exports.fetchData = fetchData;
module.exports.get_camping_tickets = get_camping_tickets;