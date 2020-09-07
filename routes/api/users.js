const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

const { signupUser } = require('./../../util/cognito');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
		console.log("register ==", email, password)
    try {
      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );
      const [ cog_user, signup_error ] = await signupUser(email, password)
      if ( signup_error || ! cog_user ) {
				console.log("user-Register" + String(signup_error))
				return res
					.status(400)
					.json({errors: [{msg: String(signup_error)}]})
			}
      let creator = false;
			console.log("register2 ==", email, password)
      user = new User({
        name,
        email,
        avatar,
        cogid: cog_user.userSub,
        creator
      });
			console.log("register3 ==", email, password)
			let createdUser = await user.save();

			const profileFields = {
				user: createdUser._id,
				website: '',
				bio: ''
			};
			console.log("register4 ==", email, password)
			await Profile.findOneAndUpdate(
        { user: createdUser._id },
        { $set: profileFields },
        { new: true, upsert: true }
      );

      // const [ token, error ] = await authenticateUser(email, password)
      //   .then(token => [ token, null ])
      //   .catch(error => [ null, error ])
			//
      // if ( error || ! token )
      //   return res
      //     .status(400)
      //     .json({ errors: [{ msg: String(error).replace(/username/gi, 'email') }] })
			//
      // return res.json({ token })
			return res.json({"msg": "Please confirm your email.", "code": "redirect"})
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({errors: [{msg:'Server error'}]});
    }
  }
);

// @route    POST api/profile/add-friend
// @desc     Add friend
// @access   Public
router.post('/accept-friend-request', auth, async (req, res) => {
	try {
		const users = await User.find({
			_id: {
				$in: [
					mongoose.Types.ObjectId(req.user.id),
					mongoose.Types.ObjectId(req.body.userId),
				],
			},
		});

		if (users && users.length && users.length === 2) {
			users.forEach((user) => {
				if (!Array.isArray(user.friends)) {
					user.friends = [];
				}
				if (user._id.toString() === req.user._id.toString()) {
					if (user.friends && user.friends.indexOf(req.body.userId) < 0) {
						user.friends.push(req.body.userId);
					}
				} else {
					if (user.friends && user.friends.indexOf(req.user._id) < 0) {
						user.friends.push(req.user._id);

						if (
							user.friendRequestSent &&
							user.friendRequestSent.indexOf(req.user._id) >= 0
						) {
							let index = user.friendRequestSent.indexOf(user._id);
							user.friendRequestSent.splice(index, 1);
						}
					}
				}
			});

			var bulk = User.collection.initializeUnorderedBulkOp();
			users.forEach((user) => {
				bulk.find({ _id: user._id }).upsert().update({ $set: user });
			});
			await bulk.execute();

			res.json({ users });
		} else {
			res.status(400).send('Invalid ids');
		}
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

router.post('/add-friend', auth, async (req, res) => {
	console.log('req.user.id ', req.user.id);
	console.log(' req.body.userId ', req.body.userId);
	try {
		const users = await User.find({
			_id: {
				$in: [
					mongoose.Types.ObjectId(req.user.id),
					mongoose.Types.ObjectId(req.body.userId),
				],
			},
		});

		let matchedUser = {};
		if (users && users.length && users.length === 2) {
			matchedUser = users.find((user) => user._id.toString() === req.user.id);

			if (matchedUser) {
				if (
					matchedUser.friendRequestSent &&
					matchedUser.friendRequestSent.indexOf(req.body.userId) < 0
				) {
					matchedUser.friendRequestSent.push(req.body.userId);
					await User.updateOne({ _id: matchedUser._id }, matchedUser);
				}
			}

			res.json({});
		} else {
			res.status(400).send('Invalid ids');
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

router.post('/reject-friend', auth, async (req, res) => {
	try {
		const user = await User.findOne({
			_id: mongoose.Types.ObjectId(req.body.userId),
		});
		console.log('user ', user);
		console.log('req.user.id ', req.user.id);

		console.log(
			'user.friendRequestPending.indexOf(mongoose.Types.ObjectId(req.body.userId)) ',
			user.friendRequestSent.indexOf(req.user.id)
		);

		if (
			user.friendRequestSent &&
			user.friendRequestSent.indexOf(req.user.id) >= 0
		) {
			let index = user.friendRequestSent.indexOf(req.user.id);
			console.log('user ', user.friendRequestSent);
			user.friendRequestSent.splice(index, 1);
			await User.updateOne({ _id: user._id }, user);
		}
		return res.json({});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//Api to get all fren request list
router.get('/friend-request-list', auth, async (req, res) => {
	try {
		const users = await User.find({
			friendRequestSent: mongoose.Types.ObjectId(req.user.id),
		}).select('_id name avatar');

		return res.json({ users });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
