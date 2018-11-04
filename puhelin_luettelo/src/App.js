import React from 'react'
import Numero from './components/Numero'
import HenkiloLisays from './components/HenkiloLisays'
import henkiloPalvelu from './services/persons'
import Ilmoitus from './components/Ilmoitus'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newName: 'anna uusi nimi',
      newNumber: '000-00000000',
      showOnly: '',
      ilmoitus : null
    }
  }

  componentDidMount() {
    console.log('did mount')
    henkiloPalvelu
      .getAll()
      .then(response => {
        this.setState({persons : response})
      })
  }

  addName = (event) => {
    event.preventDefault()
    console.log('nappia painettu')

    if(this.state.persons.some(person => person.name === this.state.newName) === false &&
      this.state.persons.some(person => person.number === this.state.newNumber) === false){   
      const bookObject ={
        name: this.state.newName,
        number: this.state.newNumber
      }  
      henkiloPalvelu
        .create(bookObject)
        .then(newPerson => {
          this.setState({
            persons : this.state.persons.concat(newPerson),
            newName : 'anna uusi nimi',
            newNumber : '000-0000000',
            ilmoitus : `lisättiin henkilö ${bookObject.name} onnistuneesti`,
            isError: false
            })
          setTimeout(() => {
              this.setState({ilmoitus: null})
            }, 5000)
          })
     }
    else if(this.state.persons.some(person => person.number === this.state.newNumber) === false){
      const temp = this.state.persons.filter(p=> p.name === this.state.newName)
      console.log(temp)
      const bookObject ={
        id: temp[0].id,
        name: this.state.newName,
        number: this.state.newNumber
      }
          this.updateName(bookObject)
    }
    else {
          alert('Nimi ja numero löytyy jo osoitekirjasta')
    }      
  }

  removeName = (id) => {
      console.log('remove')
      return () => {
      const henkilo = this.state.persons.filter(person => person.id === id)
      if (window.confirm(`'Poistetaanko ${henkilo[0].name}`)){
       henkiloPalvelu
        .remove(id)
        .then( response => {
          console.log('remove successful')
          this.setState({
            persons : this.state.persons.filter(person => person.id !== id),
            ilmoitus : 'poistettiin henkilö onnistuneesti',
            isError: false
          })
          setTimeout(() => {
            this.setState({ilmoitus: null})
          }, 5000)
        })
        .catch(error => {
          this.setState({
            ilmoitus: `henkilö on jo valitettavasti poistettu palvelimelta`,
            persons: this.state.persons.filter(p => p.id !== id),
            isError: true
          })
        setTimeout(() => {
            this.setState({ilmoitus: null})
          }, 5000)
        })
      }
    }
  }

  updateName = (bookObject) => {
    console.log('update')
    if(window.confirm(`'Päivitetäänkö ${bookObject.name}`)){
        console.log(bookObject)
        henkiloPalvelu
          .update(bookObject.id, bookObject)
          .then( response => {
            console.log('update successful')
            const persons = this.state.persons.filter(p => p.id !== bookObject.id)
            this.setState({
              persons : persons.concat(response),
              newName : 'anna uusi nimi',
              newNumber : '000-0000000',
              ilmoitus : `Päivitettiin henkilön ${bookObject.name} numero onnistuneesti`,
              isError: false
            })
            setTimeout(() => {
              this.setState({ilmoitus: null})
            }, 5000)
      })
  }
}

  handleNameChange = (event) => {
    console.log(event.target.value)
    this.setState({newName : event.target.value})
  }

  handleNumberChange = (event) => {
    console.log(event.target.value)
    this.setState({newNumber : event.target.value})
  }

  handleFilter = (event) => {
    console.log(event.target.value)
    this.setState({showOnly : event.target.value})
  }

  render() {
    const namesToShow =
    this.state.persons.filter(person => person.name.includes(this.state.showOnly))
    return (
      <div>
        <h3>haku</h3>
        <form>
        <div>
            rajaa: <input value={this.state.showOnly} onChange={this.handleFilter}/>
        </div>
        </form>
        <h2>Puhelinluettelo</h2>
        <div>
          <HenkiloLisays state={this.state}
          onSubmit={this.addName}
          handleNameChange={this.handleNameChange}
          handleNumberChange={this.handleNumberChange} />
        </div>
        <h2>Numerot</h2>
        <Ilmoitus message={this.state.ilmoitus} isError={this.state.isError}/>
        <div>
           <Numero persons={namesToShow} poista={this.removeName}/>
        </div>
      </div>
    )
  }
}


export default App;
