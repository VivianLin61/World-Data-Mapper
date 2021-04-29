import React, { useState } from 'react'
import {
  WModal,
  WMHeader,
  WMMain,
  WMFooter,
  WButton,
  WInput,
} from 'wt-frontend'

const CreateMap = (props) => {
  const [input, setInput] = useState({
    name: '',
  })

  const updateInput = (e) => {
    const { name, value } = e.target
    const updated = { ...input, [name]: value }
    setInput(updated)
  }

  const handleCreateMap = async (e) => {
    props.createNewMap(input.name)
    props.setShowCreateMap(false)
  }

  return (
    <WModal
      className='signup-modal'
      cover='true'
      visible={props.setShowCreateMap}
    >
      <WMHeader
        className='modal-header'
        onClose={() => props.setShowCreateMap(false)}
      >
        Create New Map
      </WMHeader>
      <div />
      <WMMain>
        <WInput
          className='modal-input'
          onBlur={updateInput}
          name='name'
          labelAnimation='up'
          barAnimation='solid'
          labelText='Name'
          wType='outlined'
          inputType='text'
        />
      </WMMain>
      <WMFooter>
        <WButton
          className='modal-button'
          onClick={handleCreateMap}
          clickAnimation='ripple-light'
          hoverAnimation='darken'
          shape='rounded'
          color='primary'
        >
          Submit
        </WButton>
      </WMFooter>
    </WModal>
  )
}

export default CreateMap
