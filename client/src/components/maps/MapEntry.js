import React, { useState } from 'react'
import { WInput } from 'wt-frontend'
import { useHistory } from 'react-router-dom'
import { WRow, WCol, WButton } from 'wt-frontend'

const MapEntry = (props) => {
  let history = useHistory()
  const [editing, toggleEditing] = useState(false)

  const handleEditing = (e) => {
    e.stopPropagation()
    toggleEditing(!editing)
  }

  const handleSubmit = async (e) => {
    handleEditing(e)
    const { value } = e.target
    props.renameMap(value, props._id)
  }

  const handleDeleteMap = (e) => {
    props.deleteMap(props._id)
  }

  const naviageToRegionSpreadsheet = (e) => {
    history.push(`/region/${props._id}`, { data: props.data })
  }
  return (
    <WRow>
      <WCol size='10'>
        <div
          className='map-entry'
          onDoubleClick={handleEditing}
          onClick={naviageToRegionSpreadsheet}
        >
          {editing ? (
            <WInput
              onKeyDown={(e) => {
                if (e.keyCode === 13) handleSubmit(e)
              }}
              name='name'
              onBlur={handleSubmit}
              autoFocus={true}
              defaultValue={props.name}
              className='map-item-edit'
              inputClass='map-item-edit-input'
            />
          ) : (
            <div className='map-name'>{props.name}</div>
          )}
        </div>
      </WCol>
      <WCol size='2'>
        <WButton className='map-text' onClick={handleDeleteMap} wType='texted'>
          <i className='material-icons'>close</i>
        </WButton>
      </WCol>
    </WRow>
  )
}

export default MapEntry
