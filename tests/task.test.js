const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  setupDatabase
} = require('./fixtures/db')

const userOneAuthHeader = `Bearer ${userOne.tokens[0].token}`;
const userTwoAuthHeader = `Bearer ${userTwo.tokens[0].token}`;

beforeEach(setupDatabase)

test('should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', userOneAuthHeader)
    .send({
      description: 'From my test'
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.description).toBe('From my test')
  expect(task.completed).toBe(false)
  expect(task.owner).toEqual(userOne._id)
})

test('should fetch user tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', userOneAuthHeader)
    .send()
    .expect(200)

  expect(response.body.length).toBe(2)
})

test('should delete own tasks', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', userOneAuthHeader)
    .send()
    .expect(200)

  const task = await Task.findById(taskOne._id)
  expect(task).toBeNull()
})

test('should NOT delete other users tasks', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', userTwoAuthHeader)
    .send()
    .expect(404)

  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})

// links.mead.io/extratests