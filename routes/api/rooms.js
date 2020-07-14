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

// @route    GET api/rooms
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

// @route    GET api/rooms/:roomName
// @desc     Get room by Room Name
// @access   Public
router.get(
  '/:roomName',
  async ({ params: { roomName } }, res) => {
    try {
      const room = await Room.findOne({
        name: roomName
      });
      
      if (!room) return res.status(400).json({ msg: 'Room not found' });

      return res.json(room);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
