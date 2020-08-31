const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
// bring in normalize to give us a proper url, regardless of what user entered
const Profile = require('../../models/Profile');
const Event = require('../../models/Event');
const Venue = require('../../models/Venue');


// @route    GET api/events
// @desc     Get all events
// @access   Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('user', ['name', 'avatar']);
    console.log(events)
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/events/:eventId/get
// @desc     Get event by Event Id
// @access   Private
router.get('/:eventId/get', auth, async (req, res) => {
  try {
    const eventId = req.params.eventId
    console.log('/events/' + eventId + '/get')
    const event = await Event.findById(eventId);
    console.log("events ", event)

    if (!event) return res.status(400).json({ msg: 'Event not found' });
    const _profile = await Profile.findOne({ user: req.user._id })
    if (_profile === null) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    let purchased = false
    if (_profile.events_purchased !== undefined && _profile.events_purchased != null &&
      _profile.events_purchased.length > 0) {
      const event_finder = (_id) => {
        return _id.toString() === eventId.toString()
      }
      const search_res = _profile.events_purchased.find(event_finder)
      purchased = (search_res !== undefined)
    }
    else {
      purchased = false
    }
    console.log('/events/get==return')
    const json_res = event.toJSON()
    json_res.purchased = purchased
    console.log(json_res)
    return res.json(json_res);
  } catch (err) {
    console.error("the error is ".err);
    return res.status(500).json({ msg: 'Server error' });
  }
}
);

// @route    POST api/events/:eventid
// @desc     Buy event by Event id
// @access   Private
router.get('/:eventId/buy', auth, (req, res) => {
  res = update_payment_db(req.params.eventId, req.user.id)
  if (res.code === 200) {
    return res.json({ msg: res.msg });
  } else {
    return res.status(res.code).send(res.msg);
  }
}
);

// @route    GET api/events/:eventId/get
// @desc     Get event by Event Id
// @access   Private
router.get('/:eventId/venue', auth, async (req, res) => {
  try {
    const eventId = req.params.eventId
    console.log('/events/' + eventId + '/get')
    const event = await Event.findById(eventId);
    console.log("events ", event)

    if (!event) return res.status(400).json({ msg: 'Event not found' });
    const _profile = await Profile.findOne({ user: req.user._id })
    if (_profile === null) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    console.log("_profile ", _profile)
    let purchased = false
    if (_profile.events_purchased !== undefined && _profile.events_purchased != null &&
      _profile.events_purchased.length > 0) {
      const event_finder = (_id) => {
        return _id.toString() === eventId.toString()
      }
      const search_res = _profile.events_purchased.find(event_finder)
      purchased = (search_res !== undefined)
    }
    if (!purchased) {
      return res.status(400).json({ msg: 'Please purchase the event ticket first' });
    }

    const venue = await Venue.findOne({ "event": eventId }).populate('event', ['name']);

    if (!venue) return res.status(400).json({ msg: 'Venue not found' });

    return res.json(venue);
  } catch (err) {
    console.error("the error is ".err);
    return res.status(500).json({ msg: 'Server error' });
  }
}
);

module.exports = router;
