const cheerio = require('cheerio');
const axios = require('axios');
const Event = require('../models/event');

const fetchData = async (url) => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

const get_select_values = async (ticket_name, ticket_type, select_name, url) => {
    const $ = await fetchData(url);
    let select_quantity = 0;
    const date = new Date();
    $(`select[name=${select_name}]`).children().each((index, element) => {
        const type = element.children[0].data;
        if(type !== 'Select'){
            select_quantity += 1;
        }
    });
    const ticket = {
        name: ticket_name,
        type: ticket_type,
        quantity: select_quantity,
        timestamp: date.getTime()
    };
    return ticket;
}

const get_groovin_tickets = async (url) => {
    let tickets = [];
    const ga_ticket = await get_select_values('General Admission', 'GA', 'lQuantity0', url);
    tickets.push(ga_ticket);
    const date = new Date();
    const event = new Event({
        name: 'groovin',
        tickets: tickets,
        timestamp: date.getTime()
    });
    await event.save()
    console.log(event);
}

const get_splendour_tickets = async (url) => {
    let tickets = [];
    const three_day = await get_select_values('3-Day', 'GA', 'lQuantity0', url);
    const friday = await get_select_values('Friday Only', 'GA', 'lQuantity1', url);
    const saturday = await get_select_values('Saturday Only', 'GA', 'lQuantity2', url);
    const sunday = await get_select_values('Sunday Only', 'GA', 'lQuantity3', url);
    const camping = await get_select_values('Camping', 'camping', 'lQuantity12', url);
    tickets.push(three_day, friday, saturday, sunday, camping);
    const date = new Date();
    const event = new Event({
        name: 'splendour',
        tickets: tickets,
        timestamp: date.getTime()
    });
    await event.save()
    console.log(event);
}

module.exports.fetchData = fetchData;
module.exports.get_groovin_tickets = get_groovin_tickets;
module.exports.get_splendour_tickets = get_splendour_tickets;