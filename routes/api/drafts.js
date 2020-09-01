const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Draft = require('../../models/Draft');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/drafts
// @desc     Create a draft
// @access   Private
router.post(
    '/',
    [auth],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
  
        const newDraft = new Draft({
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
          title: req.body.title,
          description: req.body.description,
          type: req.body.type,
          dash: req.body.dash
        });
  
        const draft = await newDraft.save();
  
        res.json(draft);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    GET api/draft
// @desc     Get all drafts
// @access   Private
router.get('/', auth,  async (req, res) => {
    try {
      const drafts = await Draft.find().sort({ date: -1 });
      res.json(drafts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    GET api/drafts/:id
  // @desc     Get drafts by ID
  // @access   Private
  router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
      const draft = await Draft.findById(req.params.id);

      console.log(auth);
  
      res.json(draft);
    } catch (err) {
      console.error(err.message);
  
      res.status(500).send('Server Error');
    }
  });

// @route    GET api/drafts/user/:id
// @desc     Get draft by userID
// @access   Private
router.get('/user/:id', async (req, res) => {
  try {
    const drafts = await Draft.find({user: req.params.id}).sort({ date: -1 });
    res.json(drafts);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/drafts/:id
// @desc     Delete a draft
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);

    // Check user
    if (draft.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await draft.remove();

    res.json({ msg: 'Draft removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

  module.exports = router;