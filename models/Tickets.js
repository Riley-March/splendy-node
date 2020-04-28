const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tickets_schema = new Schema({
    event_name: {
        type: String,
        required: true
    },
    tickets: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Tickets', tickets_schema);