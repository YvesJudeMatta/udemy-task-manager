const bcrypt = require('bcryptjs')
const express = require('express')

// run db setup
require('./db/mongoose')

// import routers
const userRouter =  require('./routers/user')
const taskRouter =  require('./routers/task')

const app = express()

// req.body undefined without this
// this middleware will make request boyd accessible
app.use(express.json())

// register routers
app.use(userRouter)
app.use(taskRouter)

// user reqest -> run route handler
// with middleware: new request => do something => run route handle
// middelware: function to do what you want

module.exports = app