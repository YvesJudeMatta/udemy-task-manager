const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const { sendCancellationEmail, sendWelcomeEmail } = require('../emails/account')
const User = require('../models/user')
const authenicationMiddleware = require('../middleware/authentication')

const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save()
    const token = await user.generateAuthToken()

    sendWelcomeEmail(user.email, user.name)

    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}

    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()

    res.send({ user, token })
  } catch (error) {
    res.status(401).send(error)
  }
})

router.post('/users/logout', authenicationMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.post('/users/logout/all', authenicationMiddleware, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/users/me', authenicationMiddleware, async (req, res) => {
  res.send(req.user)

  // try {
  //   const users = await User.find({});
  //   res.send(users)
  // } catch (error) {
  //   res.status(500).send(error)
  // }

  // User.find({}).then(users => {
  //   res.send(users)
  // }).catch(error => {
  //   res.status(500).send(error)
  // })
})

// router.get('/users/:id', async (req, res) => {
//   const { id: _id } = req.params || {}

//   try {
//     const user = await User.findById({ _id })

//     if (!user) {
//       return res.status(404).send()
//     }

//     res.send(user)
//   } catch (error) {
//     res.status(500).send(error)
//   }

  // mongoose takes care of transforming ids to ObjectID
  // User.findById({ _id }).then(user => {
  //   if (!user) {
  //     return res.status(404).send()
  //   }

  //   res.send(user)
  // }).catch(error => {
  //   res.status(500).send(error)
  // })
// })

router.patch('/users/me', authenicationMiddleware, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid operation' })
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()

    res.send(req.user)
  } catch (error) {
    // not handling 500 right now
    res.status(400).send(error)
  }
})

// router.patch('/users/:id', authenicationMiddleware, async (req, res) => {
//   const updates = Object.keys(req.body)
//   const allowedUpdates = ['name', 'email', 'password', 'age']
//   const isValidOperation = updates.every(update => allowedUpdates.includes(update))

//   if (!isValidOperation) {
//     return res.status(400).send({ error: 'Invalid operation' })
//   }

//   try {
//     const { id } = req.params || {};

//     const user = await User.findById(id);

//     // return new user instead of existing one
//     // make sure validations run
//     // const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

//     if (!user) {
//       return res.status(404).send()
//     }
    
//     updates.forEach(update => user[update] = req.body[update])
//     await user.save()

//     res.send(user)
//   } catch (error) {
//     // not handling 500 right now
//     res.status(400).send(error)
//   }
// })

router.delete('/users/me', authenicationMiddleware, async (req, res) => {
  try {
    await req.user.remove()
    // remove the tasks, not doing this approach

    sendCancellationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
})

// router.delete('/users/:id', authenicationMiddleware, async (req, res) => {
//   const { id } = req.params || {}

//   try {
//     const user = await User.findByIdAndDelete(id)

//     if (!user) {
//       return res.status(404).send()
//     }

//     res.send(user)
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })


// remove 'dest' to not save to directory and pass to route handler
const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File not allowed'))
    }

    cb(undefined, true)
  }
})

// npm sharp, resize, convert image type
router.post('/users/me/avatar', authenicationMiddleware, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  // req.user.avatar = req.file.buffer;
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  // 4 params needed so expressk nows this is for handling errors
  res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', authenicationMiddleware, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

// express automaticallys set for us, but well do it manually here
// <img src="data:image/jpg;base64,<binary>" />"
// <img src="<url>" />
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const { id } = req.params || {}
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
})


module.exports = router