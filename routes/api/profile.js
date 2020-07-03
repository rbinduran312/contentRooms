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

const { deleteUser } = require('./../../util/cognito')

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  console.log("inside me 12")
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('bio', 'Bio is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      website,
      bio,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;

    const profileFields = {
      user: req.user.id,
      website: website === '' ? '' : normalize(website, { forceHttps: true }),
      bio
    };

    // Build social object and add to profileFields
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
      if (value.length > 0)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const profiles = await Profile.find({user: {$ne: req.user.id}}).populate('user', ['name', 'avatar']);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const profile = await Profile.findOne({
        user: user_id
      }).populate('user', ['name', 'avatar']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    // delete cognito user
    await deleteUser(req.cognito_tokens).catch(() => undefined)

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.post('/add-friend', auth, async(req, res) => {

  try {
    const profiles = await Profile.find({
      'user': {
        $in: [
          mongoose.Types.ObjectId(req.user.id),
          mongoose.Types.ObjectId(req.body.userId),
        ]
      }
    })
    if (profiles && profiles.length && profiles.length === 2) {
      profiles.forEach(profile => {

        if (profile.user.toString() === req.user._id.toString()) {
          if (profile.friends && profile.friends.indexOf(req.body.userId) < 0) {
            profile.friends.push(req.body.userId)
          } else {
            profile.friends = [req.body.userId]
          }
        } else {
          if (profile.friends && profile.friends.indexOf(req.user._id) < 0) {
            profile.friends.push(req.user._id)
          } else {
            profile.friends = [req.user._id]
          }
        }
      });

      var bulk = Profile.collection.initializeUnorderedBulkOp()
      profiles.forEach(profile => {
        bulk.find({ _id: profile._id }).upsert().update({ $set: profile });
      })
      await bulk.execute();

      res.json({profiles});
    }else{
      res.status(400).send('Invalid ids');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
