const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = 'mongodb://Juuso:-----@ds145463.mlab.com:45463/section_3'

mongoose.connect(url, { useNewUrlParser: true })

const peopleSchema = new Schema({name: String, number: String})

peopleSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', peopleSchema)

module.exports = Person