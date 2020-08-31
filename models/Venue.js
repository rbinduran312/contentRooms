const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    stages: [{
        name: {
            type: String,
        },
        streamingUrl: {
            type: String,
        },
        sendBirdUrl: {
            type: String,
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event'
    },
});

module.exports = Venue = mongoose.model('venue', VenueSchema);
