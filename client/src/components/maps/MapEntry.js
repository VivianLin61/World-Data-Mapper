import React, { useState } from 'react'
import { WNavItem, WInput } from 'wt-frontend'
import { useMutation } from '@apollo/client'
import { RENAME_MAP } from '../../cache/mutations'
import { WRow, WCol } from 'wt-frontend'

const MapEntry = (props) => {
  const [editing, toggleEditing] = useState(false)
  const [RenameMap] = useMutation(RENAME_MAP)
  const [mapName, setMapName] = useState(props.name)

  const handleEditing = (e) => {
    e.stopPropagation()
    toggleEditing(!editing)
  }

  const handleSubmit = async (e) => {
    handleEditing(e)
    const { value } = e.target

    const { data } = await RenameMap({
      variables: {
        name: value,
        _id: props._id,
      },
    })
    setMapName(value)
  }

  return (
    <WRow>
      <WCol size='10'>
        <div onDoubleClick={handleEditing}>
          {editing ? (
            <WInput
              onKeyDown={(e) => {
                if (e.keyCode === 13) handleSubmit(e)
              }}
              name='name'
              onBlur={handleSubmit}
              autoFocus={true}
              defaultValue={props.name}
              className='map-name'
            />
          ) : (
            <div className='map-name'>{mapName}</div>
          )}
        </div>
      </WCol>
      <WCol size='2'></WCol>
    </WRow>
  )
}

export default MapEntry
