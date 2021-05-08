import React from 'react'
import { WButton } from 'wt-frontend'

const Ancestor = (props) => {
  const handleGoToAncestorRegion = (e) => {
    props.navigateToAncestorRegion(props.data, props.index)
  }
  return (
    <WButton
      className='navbar-options'
      onClick={handleGoToAncestorRegion}
      wType='texted'
      hoverAnimation='text-primary'
    >
      {props.name}
    </WButton>
  )
}

export default Ancestor
