const cheerio = require('cheerio');
const axios = require('axios');
const Tickets = require('../models/tickets');
const counter = require('../modules/counter');

const fetch_data = async (url) => {
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

const get_select_values = async (ticket_name, select_name, url) => {
    const $ = await fetch_data(url);
    let select_quantity = 0;
    $(`select[name=${select_name}]`).children().each((index, element) => {
        const select_box = element.children[0].data;
        if(select_box !== 'Select'){
            select_quantity += 1;
        }
    });
    const ticket = {
        name: ticket_name,
        quantity: select_quantity
    };
    return ticket;
}

const get_tickets = async (url) => {
    let tickets = [];
    const event_name = 'Splendour In The Grass';
    const three_day = await get_select_values('3-Day', 'lQuantity0', url);
    const friday = await get_select_values('Friday Only', 'lQuantity1', url);
    const saturday = await get_select_values('Saturday Only', 'lQuantity2', url);
    const sunday = await get_select_values('Sunday Only', 'lQuantity3', url);
    const camping = await get_select_values('Camping', 'lQuantity12', url);
    tickets.push(three_day, friday, saturday, sunday, camping);
    Tickets.findOneAndUpdate(
        {
            event_name: event_name
        },
        { 
            tickets: tickets
        },
        {
            new: true,
            runValidators: true
        })
    .then(doc => {
        console.log(doc);
    })
    .catch(err => {
        console.error(err);
    });
    //counter.create_event_stats(event_name, tickets);
    //counter.calculate_daily_stats(event.tickets);
}

module.exports.get_tickets = get_tickets;