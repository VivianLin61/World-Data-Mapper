import React, { useState } from 'react'
import {
  WModal,
  WMHeader,
  WMMain,
  WMFooter,
  WButton,
  WInput,
  WRow,
} from 'wt-frontend'
import WCol from 'wt-frontend/build/components/wgrid/WCol'

const Delete = (props) => {
  const handleDeleteMap = async (e) => {
    props.deleteMap(props.mapToDeleteId)
    props.setShowDeleteMap(false)
  }

  return (
    <WModal
      className='delete-modal'
      cover='true'
      visible={props.setShowDeleteMap}
    >
      <WMHeader
        className='modal-header'
        onClose={() => props.setShowDeleteMap(false)}
      >
        Delete Map?
      </WMHeader>
      <div />

      <WMFooter>
        <WRow>
          <WCol size='5'>
            <WButton
              className='modal-button'
              onClick={() => props.setShowDeleteMap(false)}
              clickAnimation='ripple-light'
              hoverAnimation='darken'
              shape='rounded'
              color='primary'
            >
              Cancel
            </WButton>
          </WCol>
          <WCol size='2'></WCol>
          <WCol size='5'>
            <WButton
              className='modal-button'
              onClick={handleDeleteMap}
              clickAnimation='ripple-light'
              hoverAnimation='darken'
              shape='rounded'
              color='primary'
            >
              Delete
            </WButton>
          </WCol>
        </WRow>
      </WMFooter>
    </WModal>
  )
}

export default Delete
