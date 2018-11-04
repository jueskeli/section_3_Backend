import React from 'react';

const Numero = ({persons, poista}) => {
    console.log(persons)
      return (
        <ul>
             {persons.map(person => <li key={person.id}>{person.name} {person.number} <button onClick={poista(person.id)}> poista</button></li>)}
        </ul>
      )
  }
  
  export default Numero