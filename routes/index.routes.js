const Beer = require('../models/Beer.model')

const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.json('All good in here')
})

router.get('/beers', async (req, res, next) => {
  const beers = await Beer.find()

  res.json(beers)
})

router.get('/beers/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const beer = await Beer.findById(id)

    res.json({ ...beer._doc })
  } catch (error) {
    res.status(404).json({ message: 'No beer with this id' })
  }
})

router.post('/beers', async (req, res, next) => {
  const body = req.body
  console.log(body)
  const beer = await Beer.create(body)

  res.status(201).json({ beer })
})

router.put('/beers/:id', async (req, res, next) => {
  const { id } = req.params
  const body = req.body

  const beer = await Beer.findByIdAndUpdate(id, body, { new: true })

  res.json({ beer })
})

router.delete('/beers/:id', async (req, res, next) => {
  const { id } = req.params
  const beer = await Beer.findByIdAndDelete(id)

  res.json(beer)
})

module.exports = router
