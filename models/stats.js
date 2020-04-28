const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stats_schema = new Schema({
    event_name: {
        type: String,
        required: true
    },
    tickets: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Stats', stats_schema);