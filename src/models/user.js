const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // default: false
      trim: true
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number')
        }
      }
    },
    email: {
      type: String,
      unique: true, // create index to create unique, need to wipe data
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password should not contain "password"')
        }
      }
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
)

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// mongoose gets called
userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token;
}

// single error to prevent hackers knowing more
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// won't work on patch.
// certain mongoose queiries bypass middleware, need to tweak
// hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    const rounds = 8;
    user.password = await bcrypt.hash(user.password, rounds)
  }

  next()
})

// delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this

  await Task.deleteMany({
    owner: user._id
  })

  next()
})

// converts to schema nyways
const User = mongoose.model('User', userSchema)

module.exports = User;