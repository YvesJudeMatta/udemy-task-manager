// CRUD

// Promises
// make easy to manage s=async, desgined for problems callbacks
// promises build on callback pattern, enhancment
//

const mongodb = require('mongodb');
const { MongoClient, ObjectID } = mongodb;
// const mongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

// using 'localhost' instead has had strange issues
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {
  useNewUrlParser: true, // required for depricated
  useUnifiedTopology: true // required for depricated
}, (error, client) => {
  if (error) {
    console.log('Unable to connect to database')
    return;
  }

  // mongodb will create for us if non-exist
  const db = client.db(databaseName)

  // async
  // http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#insertOne
  // db.collection('users').insertOne({
  //   name: 'Yves',
  //   age: 26
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   }

  //   console.log(result.ops);
  // })

  // http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#insertMany
  // db.collection('users').insertMany([
  //   {
  //     name: 'John',
  //     age: 28
  //   },
  //   {
  //     name: 'Doe',
  //     age: 27
  //   }
  // ], (error, result) => {
  //   if (error) {
  //     return console.log('Unstable to insert docs')
  //   }

  //   console.log(result.ops)
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'eat salad',
  //     completed: true
  //   },
  //   {
  //     description: 'udemy node course',
  //     completed: false
  //   },
  //   {
  //     description: 'move my car',
  //     completed: true
  //   }
  // ], (error, result) => {
  //   if (error) {
  //     return console.log('unable to insert docs')
  //   }

  //   console.log(result.ops);
  // })

  // id auto cereated by mongo
  // what is ObjectId?
  // - mysql auto increment id by one, mongo is guid (globally) algorithm without server deciding which one
  // - scale one, no change of id collection with guid
  // - mysql user one server and another might collide, with guid we don't have that
  // - we can generate the guids of our own

  // optionall remove new since mongo has defensive programming
  // 12-byte ObjectId
  // - 4 byte value representing the seconds the uniz
  // - 5bye - random
  // - 3byte - couter, starting with a random value
  // bineary instead of string, cut size og og object in half

  // const id = new ObjectID();
  // console.log(id)
  // console.log(id.id)
  // console.log(id.id.length)
  // console.log(id.toHexString())
  // console.log(id.toHexString().length)
  // console.log(id.getTimestamp())

  // ObjectId('<guid>') => binary

  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'Mary',
  //   age: 27
  // }, (error, result) => {
  //   if (error) {
  //     return;
  //   }

  //   console.log(result.ops)
  // })

  // return first found
  // null if no user is found
  // user object returned if found
  // searching by '_id' we need to provide ObjectId
  // db.collection('users').findOne({ _id: new ObjectID('5db0da7723a86779dd54815f') }, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }

  //   console.log(user);
  // })

  // retunrs cursor to point to database
  // pointer to data
  // find not assume array, matching documents, 
  // const cursor = db.collection('users').find({ age: 27 })
  // cursor.toArray((error, users) => {
  //   console.log(users);
  // })

  // no need to fetch all those records, store record in memeory in nodejs only to get count
  // mongo transfers single integer
  // cursor.count((error, count) => {
  //   console.log(count);
  // })

  // db.collection('tasks').findOne({
  //   _id: new ObjectID('5db0d4bcdfafec79a265b351')
  // }, (error, user) => {
  //   console.log(user)
  // })

  // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
  //   console.log(tasks)
  // })

  // update depcricated
  // update operators, age will stay the same
  // db.collection('users').updateOne({
  //   _id: new ObjectID('5da3e70fa05d0fad725aea7b')
  // }, {
  //   // $set: {
  //   //   name: 'Mike'
  //   // }
  //   $inc: {
  //     age: 1
  //   }
  // }).then(result => {
  //   // modifiedCount 1/0
  //   // matchedCout 1/0
  //   console.log(result)
  // }).catch(error => {
  //   console.log(error)
  // })

  // db.collection('tasks').updateMany(
  //   { completed: false },
  //   {
  //     $set: {
  //       completed: true
  //     }
  //   }
  // ).then(result => {
  //   console.log(result)
  // }).catch(error => {
  //   console.log(error)
  // })

  // deleteMany, deleteOne. Remove is depricated
  // db.collection('users').deleteMany({
  //   age: 27
  // }).then(result => {
  //   console.log(result)
  // }).catch(error => {
  //   console.log(error)
  // })

  // db.collection('tasks').deleteOne({
  //   description: 'eat salad'
  // }).then(result => {
  //   console.log(result)
  // }).catch(error => {
  //   console.log(error)
  // })
})
