require('dotenv').config()
const express = require('express');
const websocket = require('ws');
const http = require('http');
const mongoose = require('mongoose');
const Event = require('./models/event');
const body_parser = require('body-parser');
const path = require('path');

const scraper = require('./modules/scraper');

const app = express();
const server = http.createServer(app);

const wss = new websocket.Server({ server })

wss.on('connection', async (client) => {
    console.log('Client Connected');
    const event = await Event.find({}).sort({_id:-1}).limit(1);
    client.send(JSON.stringify(event[0]));
});

//Push updates to client every 30 seconds
setInterval(async () => {
    wss.clients.forEach(async (client) => {
        const event = await Event.find({}).sort({_id:-1}).limit(1);
        client.send(JSON.stringify(event[0]));
    });
    console.log('Update Pushed');
}, 30000);

//Scrape the website every 10 minutes
setInterval(async () => {
    console.log('Scraping Website');
    await scraper.get_groovin_tickets('https://www.moshtix.com.au/v2/event/groovin-the-moo-townsville-2020/117128');
    await scraper.get_splendour_tickets('https://www.moshtix.com.au/v2/event/splendour-in-the-grass-2020/119191')
}, 600000)

console.log(process.env.MONGO_PASS)

mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then(() => {
        server.listen(5000);
        console.log('Listening on port 5000');
    }).catch(err => {
        console.log(err);
});