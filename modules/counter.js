const Stats = require('../models/stats');

const create_event_stats = (event_name, event_tickets) => {
    const tickets = event_tickets.map(ticket => {
        return {
            name: ticket.name,
            stats: [
                {
                    type: 'Daily',
                    quantity: 0
                },
                {
                    type: 'Weekly',
                    quantity: 0
                },
                {
                    type: 'Alltime',
                    quantity: 0
                }
            ]
        }
    });
    const event_stats = new Stats({
        event_name: event_name,
        tickets: tickets
    });
    console.log(event_stats);
    event_stats.save();
}

const calculate_daily_stats = (tickets) => {
    tickets.forEach(ticket => {
        Stats.findOneAndUpdate(
            {
                type: ticket.name
            },
            { $inc: 
                {
                    daily_stats: ticket.quantity,
                    alltime_stats: ticket.quantity
                }
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
    });   
}

module.exports.create_event_stats = create_event_stats;
module.exports.calculate_daily_stats = calculate_daily_stats;
