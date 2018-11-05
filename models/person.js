const mongoose = require('mongoose')
const Schema = mongoose.Schema

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

const peopleSchema = new Schema({ name: String, number: String })

peopleSchema.statics.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', peopleSchema)

module.exports = Person
