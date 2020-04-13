const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const event_schema = new Schema({
    name: {
        type: String,
        required: true
    },
    tickets: {
        type: Array,
        required: false
    },
    timestamp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Event', event_schema);