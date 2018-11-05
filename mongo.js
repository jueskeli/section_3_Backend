const mongoose = require('mongoose')

const url = 'mongodb://Juuso:-----@ds145463.mlab.com:45463/section_3'

mongoose.connect(url, { useNewUrlParser: true })

const Numero = mongoose.model('Number', {
  Name: String,
  Number: String
})

const numero = new Numero({
  Name: process.argv[2],
  Number: process.argv[3]
})

if (process.argv.length === 2) {
  Numero
    .find({})
    .then(result => {
      console.log('puhelinluettelo')
      result.forEach(numero => {
        console.log(`${numero.Name}  ${numero.Number}`)
      })
      mongoose.connection.close()
    })
} else {
  numero
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${numero.Name} numero ${numero.Number} luetteloon`)
      mongoose.connection.close()
    })
}
