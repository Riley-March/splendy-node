require('dotenv').config()
const express = require('express');
const websocket = require('ws');
const http = require('http');
const mongoose = require('mongoose');
const Stats = require('./models/stats');
const Tickets = require('./models/tickets');

const scraper = require('./modules/scraper');

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    next();
});

const wss = new websocket.Server({ server });

wss.on('connection', async (client) => {
    console.log('Client Connected');
    const tickets = await Tickets.find({}).sort({_id:-1}).limit(1);
    client.send(JSON.stringify(tickets));
});

//Push updates to client every 30 seconds
setInterval(async () => {
    wss.clients.forEach(async (client) => {
        const tickets = await Tickets.find({}).sort({_id:-1}).limit(1);
        client.send(JSON.stringify(tickets));
    });
    console.log('Update Pushed');
}, 30000);

//scraper.get_tickets('https://www.moshtix.com.au/v2/event/splendour-in-the-grass-2020/119191');

//Scrape the website every 10 minutes
// setInterval(async () => {
//     console.log('Scraping Website');
//     await scraper.get_splendour_tickets('https://www.moshtix.com.au/v2/event/splendour-in-the-grass-2020/119191')
// }, 600000)

app.get('/get_stats', (req, res) => {
    Stats.find({}, function(err, stats) {
        res.json(stats);
    });
});

mongoose.connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => {
        server.listen(5000);
        console.log('Listening On Port 5000');
    }).catch(err => {
        console.log(err);
});