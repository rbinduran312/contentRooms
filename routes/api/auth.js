const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');
const {OAuth2Client} = require('google-auth-library');
const normalize = require('normalize-url');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const { authenticateUser, resendConfirm } = require('./../../util/cognito')
const { generateAccessToken } = require('./../../util/jwt_token')
const gravatar = require('gravatar');


// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ cogid: req.user.cogid }).select('-password').select('-cogid');
    if ( ! user ) return res.status(401).send('Unauthenticated')
    res.json({...user.toObject(), ...( req.user.new_tokens && { new_tokens: req.user.new_tokens } )});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log("post /api/auth " + user)
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const [ token, error ] = await authenticateUser(email, password)
        .then(token => [ token, null ])
        .catch(error => [ null, error ])

      if ( error || ! token ) {
        if (error === "User is not confirmed.") {
          await resendConfirm(email)
        }
        return res
          .status(400)
          .json({ errors: [{ msg: String(error) }] })
      }
      return res.json({ token })
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/google_auth', async (req, res) => {
  console.log("google_auth")
  const tokenObj = req.body
  const client = new OAuth2Client(config.get("GOOGLE_CLIENT_ID"));
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenObj.id_token,
      audience: config.get("GOOGLE_CLIENT_ID"),  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload)
    const email = payload.email
    const googleId = payload.sub
    const name = payload.name

    let user = await User.findOne({email});
    console.log(user)
    if (user == null) {
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );
      const creator = false;
      user = new User({
        name,
        email,
        avatar,
        googleId,
        creator
      });

      let createdUser = await user.save();

      const profileFields = {
        user: createdUser._id,
        website: '',
        bio: ''
      };

      await Profile.findOneAndUpdate(
        { user: createdUser._id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
    }
    return res.json({ token: tokenObj.id_token })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
