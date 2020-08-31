const Profile = require('../../models/Profile');
const Event = require('../../models/Event');
const User = require('../../models/User');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Stripe = require('stripe');
const Postdb = require('../../util/postdb')

// @route    GET api/events
// @desc     Get all events
// @access   Public

const update_payment_db = async (eventId, userId, email) => {
  try {
    console.log(eventId)
    const _event = await Event.findById(eventId)
    if (_event === undefined) {
      console.log('event not found')
      return {msg: 'Server Error', code: 400}
    }
    const profile = await Profile.findOne({user: userId})
    console.log(profile)
    if (profile.events_purchased != null &&
      profile.events_purchased.length > 0) {
      console.log('events_purchased length > 0')
      const event_finder = (_id) =>{
        return _id.toString() === eventId.toString()
      }
      const search_res = profile.events_purchased.find(event_finder)
      if (search_res === undefined) {
        profile.events_purchased.push(eventId)
        profile.save()
        await Postdb.UpdateDB(userId, email, eventId)
        return {msg: 'You can join this event', code: 200}
      }
      return {msg: 'You have already purchased', code: 200}
    }
    else {
      console.log('events_purchased length == 0')
      await Profile.updateOne({user: userId},{$push: { events_purchased: eventId}},{ upsert:true})
      await Postdb.UpdateDB(userId, email, eventId)
      return {msg: 'You can join this event', code: 200}
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    return {msg: 'Server Error', code: 500}
  }
}

router.get('/key', auth,async (req, res) => {
  try {
    const publish_key = 'pk_test_rVMPie5VyOotVrGSwj7pY569009vzDUZMu'

    res.json({'pub': publish_key});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/method', [auth],async (req, res) => {
  try {
    console.log(req.body)
    const _token = req.body.token
    const stripeEmail = _token.email
    const stripeToken = _token.id
    const token_type = _token.type
    const amount = req.body.amount
    const event_id = req.body.data
    const currency = 'USD'
    const apiKeySecret = 'sk_test_SppZvSDr3xFzjZsCWpho0syq00JVt60JaQ'
    const stripe = Stripe(apiKeySecret);
    const payment_kind = req.body.payment_kind

    let customer_id
    if (req.user.customer_id === undefined || req.user.customer_id === null) {
      const customer = await stripe.customers.create({
        email: stripeEmail,
        source: stripeToken,
        metadata: {
          userId: req.user.id,
        },
      });
      const _user = await User.findOne({ cogid: req.user.cogid })
      _user.customer_id = customer.id
      _user.save()
      customer_id = customer.id
    }
    else {
      customer_id = req.user.customer_id
    }
    try {
      const charge = await stripe.charges.create(
        {
          amount,
          currency: currency,
          customer: customer_id,
        },
      );
      //update postgres db
      if (payment_kind === 'Event') {
        await update_payment_db(event_id, req.user.id, stripeEmail)
      }

      console.log('charge:');
      console.log(charge)
      res.json(charge)
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;