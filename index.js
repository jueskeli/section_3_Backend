const express = require('express')
var logger = require('morgan')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

logger.token('requestData', function(request, response) {return JSON.stringify(request.body)})
app.use(logger(':method :url :status :requestData'))
app.use(logger('tiny'))
app.use(cors())
app.use(express.static('build'))

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}

const generateId = () => {
  return getRandomInt(100000)
}

let persons = [
    {
      id: 1,
      name: 'Pekka Puupaa',
      number: '07001212313'
    },
    {
      id: 2,
      name: 'Pertti Puujalka',
      number: '0100100100'
    },
    {
      id: 3,
      name: 'Jarmo Tarmo',
      number: '+358403155152'
    },
    {
      id: 4,
      name: 'Arto Hellas',
      number: '040-123456'
    },
]



app.get('/api', (req, res) => {
  res.send('<h1>Teretulemast tänne backendiin!</h1> <h2> sections: <ul> <li> info </li> <li> persons </li> </ul> </h2>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  res.send(
    `<div> puhelinluettelossa ${persons.length} henkilön tiedot </div> <div> ${new Date()}</div>`
  )
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'Nimi tai numero puuttuu' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  if(persons.find(p => p.name === person.name)) {
    return response.status(400).json({error: 'Henkilö on jo lisätty luetteloon'})
  }
  else{
    persons = persons.concat(person)
    response.json(person)
  }
  
})