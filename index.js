const express = require('express')
var logger = require('morgan')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Person = require('./models/person')

app.use(bodyParser.json())

logger.token('requestData', function(request, response) {return JSON.stringify(request.body)})
app.use(logger(':method :url :status :requestData'))
app.use(logger('tiny'))
app.use(cors())
app.use(express.static('build'))

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}


app.get('/api', (req, res) => {
  res.send('<h1>Teretulemast tänne backendiin!</h1> <h2> sections: <ul> <li> info </li> <li> persons </li> </ul> </h2>')
})

app.get('/api/persons', (req, res) => {
  Person
  .find({})
  .then(persons => {
    res.json(persons.map(Person.format))
  })
  .catch(error => {
    console.log(error)
  })
})

app.get('/api/info', (req, res) => {
  Person
    .countDocuments({})
    .then(count => {
      res.send(
        `<div> puhelinluettelossa ${count} henkilön tiedot </div> <div> ${new Date()}</div>`
      )
    })
    .catch(err => {
      res.status(400).send()
    })
})


app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({error : 'ei ole kunnollinen ID'})
    })
})


app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'ei ole kunnollinen ID'})
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log(body)
  if (body.name === "" || body.number === "") {
    return response.status(400).json({ error: 'Nimi tai numero puuttuu' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({name: body.name})
    .then(result => {
      if(result.length > 0){
        response.status(400).send({ error: 'Nimi on jo kannassa'})
      }
      else {
        person.save()
        .then(savedPerson => {
          response.json(Person.format(savedPerson))
        })
        .catch(error => {
          console.log(error)
        })
      }
    })
})

app.put('/api/persons/:id', (request, response) => {
  Person
    .findOneAndUpdate({name: request.body.name}, request.body, {new: true})
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'ei ole kunnollinen ID' })
    })
  })
