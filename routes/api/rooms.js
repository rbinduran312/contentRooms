const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Room = require('../../models/Room');


const { deleteUser } = require('../../util/cognito')

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const room = await Room.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!room) {
      return res.status(400).json({ msg: 'There is no room for this user' });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/room
// @desc     Get all rooms
// @access   Public
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().populate('user', ['name', 'avatar']);
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/room/user/:user_id
// @desc     Get room by user ID
// @access   Public
router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const room = await Room.findOne({
        user: user_id
      }).populate('user', ['name', 'avatar']);

      if (!room) return res.status(400).json({ msg: 'Room not found' });

      return res.json(room);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
