const express = require('express')
const Task = require('../models/task')
const authenicationMiddleware = require('../middleware/authentication')

const router = new express.Router()

router.post('/tasks', authenicationMiddleware, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }

  // task.save().then(() => {
  //   res.status(201).send(task);
  // }).catch(error => {
  //   res.status(400).send(error)
  // })
});

/// GET /tasks?completed=(false/true)
// GET /tasks?limit=10&skip=0 (skip 10 = 1 page, 20 = 2 page)
// GET /tasks?sortBy=createdAt:(asc/desc)
router.get('/tasks', authenicationMiddleware, async (req, res) => {
  try {
    // completed is string
    const { completed, limit, skip, sortBy } = req.query || {};

    // const findParams = { owner: req.user._id };
    const match = {};
    const sort = {};

    if (typeof completed !== 'undefined') {
      match.completed = completed === 'true'
    }

    if (typeof sortBy !== 'undefined') {
      const parts = sortBy.split(':')
      sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(limit, 10),
        skip: parseInt(skip, 10),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)

    // const tasks = await Task.find(findParams);
    // res.send(tasks)
  } catch (error) {
    res.status(500).send(error)
  }
  // Task.find({}).then(tasks => {
  //   res.send(tasks)
  // }).catch(error => {
  //   res.status(500).send(error)
  // })
})

router.get('/tasks/:id', authenicationMiddleware, async (req, res) => {
  const { id: _id } = req.params || {};

  try {
    // const task = await Task.findById({ _id });
    const task = await Task.findOne({
      _id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }

  // Task.findById({ _id }).then(task => {
  //   if (!task) {
  //     return res.status(404).send()
  //   }

  //   res.send(task)
  // }).catch(error => {
  //   res.status(500).send(error)
  // })
})

router.patch('/tasks/:id', authenicationMiddleware, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

  if (!isValidUpdate || updates.length === 0) {
    return res.status(400).send({ error: 'invalid update' })
  }

  try {
    const { id } = req.params || {};

    const task = await Task.findOne({
      _id: id,
      owner: req.user._id
    })

    // const task = await Task.findById(id)

    // const task = await Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!task) {
      return res.status(404).send()
    }
    
    updates.forEach(update => {
      task[update] = req.body[update]
    })
    await task.save()

    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', authenicationMiddleware, async (req, res) => {
  const { id } = req.params || {}

  try {
    // const task = await Task.findByIdAndDelete(id)

    const task = await Task.findOneAndDelete({
      _id: id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router;