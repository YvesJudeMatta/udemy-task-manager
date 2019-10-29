const request = require('supertest')

const app = require('../src/app')
const User = require('../src/models/user')
const {
  userOneId,
  userOne,
  setupDatabase
} = require('./fixtures/db')

const userOneAuthHeader = `Bearer ${userOne.tokens[0].token}`;

beforeEach(setupDatabase)

test('should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Yves Matta',
      email: 'yves_matta@hotmail.com',
      password: 'redhat123!'
    })
    .expect(201)

  // Assert that te database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Yves Matta',
      email: 'yves_matta@hotmail.com',
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('redhat123!')
})

test('should NOT signup user with invalid name/email/password', async () => {
  const valid = {
    name: 'Yves Matta',
    email: 'yves_matta@hotmail.com',
    password: 'redhat123!'
  }
  await request(app)
    .post('/users')
    .send({
      name: '',
      email: valid.email,
      password: valid.password
    })
    .expect(400)
  await request(app)
    .post('/users')
    .send({
      name: valid.name,
      email: 'asd',
      password: valid.password
    })
    .expect(400)
  await request(app)
    .post('/users')
    .send({
      name: valid.name,
      email: valid.email,
      password: 'password'
    })
    .expect(400)
})

test('should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200)
  
  // fetch user from database
  const user = await User.findById(userOne._id)

  // assert token in response matches users second token in database
  // first token is created in beforeEach, this login endpoint will create
  // another token
  expect(response.body).toMatchObject({
    token: user.tokens[1].token
  })
})

test('should NOT login NON existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password + '!'
    })
    .expect(401)
})

test('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', userOneAuthHeader)
    .send()
    .expect(200)
})

test('should NOT get profile for unatuenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', userOneAuthHeader)
    .send()
    .expect(200)

  const user = await User.findById(userOne._id)
  expect(user).toBeNull()
})

test('should NOT delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', userOneAuthHeader)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

  const user = await User.findById(userOne._id)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', userOneAuthHeader)
    .send({
      name: 'John'
    })
    .expect(200)

  // fetch the user in the database
  const user = await User.findById(userOne._id)

  // expect fields to contain updates from request body
  expect(user.name).toBe('John')
})

test('should NOT update valid user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: 'John'
    })
    .expect(401)

    // fetch the user in the database
    const user = await User.findById(userOne._id)
  
    // expect fields to NOT contain updates from request body
    expect(user.name).not.toBe('John')
})

test('should NOT update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', userOneAuthHeader)
    .send({
      location: 'Toronto'
    })
    .expect(400)

    // fetch the user in the database
    const user = await User.findById(userOne._id)
  
    // expect fields to NOT contain updates from request body
    expect(user.location).not.toBe('Toronto')
})