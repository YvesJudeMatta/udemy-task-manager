const mongoose = require('mongoose')

const connectOptions = {
  useNewUrlParser: true, // required for depricated
  useUnifiedTopology: true, // required for depricated
  useCreateIndex: true,
  useFindAndModify: false
};

// uses mongo behind the scene
mongoose.connect(process.env.MONGODB_URL, connectOptions);

// define model
// takes model name, lowercase and pluralize (mongoose)
// mongoose doesnt have much validation but we can create our own
// only if provided, validte runs
// populate validater for npm


// create instance of model
// const me = new User({
//   name: 'Yves',
//   age: 'Mike'
// })
// const me = new User({
//     name: '   Yves    ',
//     email: 'yves.matta7@gmail.com  ',
//     password: ' passwors '
// })

// save model and returns promise
// me.save().then(() => {
//   console.log(me)
// }).catch(error => {
//   console.log('Error!', error)
// })

// const Task = mongoose.model('Task', {
//   description: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   }
// })

// const task = new Task({
//   description: 'complete Udemy course4',
//   completed: false
// })

// task.save().then(() => {
//   console.log(task)
// }).catch(error => {
//   console.log(error)
// })

// __v: mongoose, version 