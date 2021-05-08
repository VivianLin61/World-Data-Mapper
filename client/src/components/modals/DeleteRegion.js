import React from 'react'
import { WModal, WMHeader, WMFooter, WButton, WRow } from 'wt-frontend'
import WCol from 'wt-frontend/build/components/wgrid/WCol'

const DeleteRegion = (props) => {
  const handleDeleteRegion = async (e) => {
    const { region, regionId, index } = props.regionToDeleteParams.regionParams
    props.deleteRegion(region, regionId, index)
    props.setShowDeleteRegion(false)
  }

  return (
    <WModal className='delete-modal' cover='true' visible={true}>
      <WMHeader
        className='modal-header'
        onClose={() => props.setShowDeleteRegion(false)}
      >
        Delete Region?
      </WMHeader>
      <div />
      <WMFooter>
        <WRow>
          <WCol size='5'>
            <WButton
              className='modal-button'
              onClick={() => props.setShowDeleteRegion(false)}
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
              onClick={handleDeleteRegion}
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

export default DeleteRegion
