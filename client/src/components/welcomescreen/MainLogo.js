import React from 'react'
import globe from '../../images/globe.png'

const MainLogo = (props) => {
  return (
    <div className='main-logo'>
      <img className='center' src={globe}></img>
      <h1 className='logo-text'>Welcome To The World Data Mapper </h1>
    </div>
  )
}

export default MainLogo
