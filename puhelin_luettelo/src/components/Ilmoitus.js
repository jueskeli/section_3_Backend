import React from 'react';
import './index.css'

const Ilmoitus = ({ message, isError }) => {
  if (message === null) {
    return null
  }
  if(isError){
    return (
     <div className="error">
        {message}
     </div>
  )
  }
  return (
    <div className="notification">
    {message}
 </div>
  )
}
  
  export default Ilmoitus