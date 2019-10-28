require('../src/db/mongoose');

const Task = require('../src/models/task')

// 5db1c1a520edb77c2344c474
// 5db21f4afc9e0b7e8a41ada2

// $set, mongoose takes care of it
// Task.findByIdAndDelete('5db21f4afc9e0b7e8a41ada2')
//   .then(task => {
//     console.log(task)
//     // Model.count depcricated
//     return Task.countDocuments({ completed: false })
//   })
//   .then(count => {
//     console.log(count)
//   })
//   .catch(e => console.log(e))

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false })
  return count;
}

deleteTaskAndCount('5db21f5e06bd4c7e9972be43')
  .then(count => {
    console.log(count)
  })
  .catch(e => console.log(e))