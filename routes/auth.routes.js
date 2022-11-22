const { genSaltSync, hashSync, compareSync } = require('bcryptjs')
const jwt = require('jsonwebtoken')
const isAuthenticated = require('../middlewares/isAuthenticated')

const User = require('../models/User.model')

const router = require('express').Router()

router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  // Encrypt pwd
  const salt = genSaltSync(11)
  const hashedPassword = hashSync(password, salt)
  // Record to DB
  await User.create({ username, hashedPassword })
  res.status(201).json({ message: 'User created' })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const currentUser = await User.findOne({ username })

  console.log(currentUser)

  // CHeck if our user exists
  if (currentUser) {
    // Check the password of our user
    if (compareSync(password, currentUser.hashedPassword)) {
      const userCopy = { ...currentUser._doc }
      delete userCopy.hashedPassword
      // Generate the JWT (don't forget to put a secret in your .env file)
      const authToken = jwt.sign(
        {
          expiresIn: '6h',
          user: userCopy,
        },
        process.env.TOKEN_SECRET,
        {
          algorithm: 'HS256',
        }
      )

      res.status(200).json({ status: 200, token: authToken })
    } else {
      res.status(400).json({ message: 'Wrong password' })
    }
  } else {
    res.status(404).json({ message: 'No user with this username' })
  }
})

router.get('/verify', isAuthenticated, (req, res) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload)

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json({ payload: req.payload, message: 'Token OK' })
})

module.exports = router
