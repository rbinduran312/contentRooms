const jwt = require('jsonwebtoken');
const config = require('config');
const {OAuth2Client} = require('google-auth-library');

const { tokenValidator } = require('./../util/cognito')

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log("middle ware == ", token)
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const client = new OAuth2Client(config.get("GOOGLE_CLIENT_ID"));
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.get("GOOGLE_CLIENT_ID"),  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload)
    const email = payload.email
    const googleId = payload.sub
    const name = payload.name
    const user = await User.findOne({ email })
    if ( user ) {
      req.user = { ...user.toObject(), ...req.user, id: user._id.toString() }
    }
    return next()
  } catch {

  }
  console.log("not google auth")
  try {
    token_data = JSON.parse(Buffer.from(token, 'base64').toString())
    const {sub: cogid, _refresh_session: new_tokens} = await tokenValidator(token_data)
    req.user = {cogid, ...(new_tokens && {new_tokens})}

    if (req.user.cogid) {
      const user = await User.findOne({cogid: req.user.cogid}).select('-password')

      if (user) {
        req.user = {...user.toObject(), ...req.user, id: user._id.toString()}
      }
    }

    req.cognito_tokens = new_tokens ? JSON.parse(Buffer.from(new_tokens, 'base64').toString()) : null
    req.cognito_tokens = req.cognito_tokens || token_data

    next()
  } catch (err) {
    console.log(`cognito.tokenValidator ended with an error: ${err}`)
    res.status(500).json({msg: 'Server Error'});
  }
};
