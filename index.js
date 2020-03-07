const express = require('express');
const websocket = require('ws');
const http = require('http');
const mongoose = require('mongoose');
const Ticket = require('./models/ticket');
const body_parser = require('body-parser');
const path = require('path');

const scraper = require('./modules/scraper');

const app = express();
const server = http.createServer(app);

const wss = new websocket.Server({ server })

wss.on('connection', async (client) => {
    const tickets = await Ticket.find({}).sort({_id:-1}).limit(1);
    client.send(JSON.stringify(tickets[0]));
});

setInterval(async () => {
    //const camping_tickets = scraper.get_camping_tickets('https://www.moshtix.com.au/v2/event/groovin-the-moo-townsville-2020/117128');
    wss.clients.forEach(function each(client) {
        const date = new Date();
        const ticket = {
            type: 'Groovin_GA',
            quantity: Math.floor(Math.random() * 5),
            timestamp: date.getTime()
        };
        client.send(JSON.stringify(ticket));
    });
    console.log('data sent');
}, 30000);

app.use('/', async (req, res) => {
    res.send('tester');
});

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-vzdx1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then(() => {
        server.listen(5000);
        console.log('Listening on port 5000');
    }).catch(err => {
        console.log(err);
});