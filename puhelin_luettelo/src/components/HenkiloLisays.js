import React from 'react';

class HenkiloLisays extends React.Component {
  render(){
    return (
      <form onSubmit={this.props.onSubmit}>
      <div>
        nimi: <input value={this.props.state.newName} onChange={this.props.handleNameChange}/>
      </div>
      <div>
        numero: <input value={this.props.state.newNumber} onChange={this.props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
    )
  }
}
  
  export default HenkiloLisays