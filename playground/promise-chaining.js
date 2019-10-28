require('../src/db/mongoose');

const User = require('../src/models/user')

// $set, mongoose takes care of it
// User.findByIdAndUpdate({ _id: '5db1c6a9add63a7cb80d2188' }, { age: 1 })
//   .then(user => {
//     console.log(user)
//     // Model.count depcricated
//     return User.countDocuments({ age: 1 })
//   })
//   .then(count => {
//     console.log(count)
//   })
//   .catch(e => console.log(e))

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age })
  const count = await User.countDocuments({ age })

  return count
}

updateAgeAndCount('5db1c6a9add63a7cb80d2188', 2)
  .then(count => {
    console.log(count)
  })
  .catch(e => console.log(e))