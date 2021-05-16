import React, { useState } from 'react'
import { WButton, WInput, WRow, WCol } from 'wt-frontend'

const LandmarkEntry = (props) => {
  const landmark = props.landmark
  const editing = props.editable.indexOf(landmark) > -1 ? true : false

  const [editingName, toggleNameEdit] = useState(false)

  const handleNameEdit = (e) => {
    toggleNameEdit(false)
    const newLandmark = e.target.value ? e.target.value : 'No Name'
    const prevLandmark = landmark
    if (newLandmark !== prevLandmark) {
      props.editRegionLandmark(prevLandmark, newLandmark)
    }
  }
  const handleDeleteLandmark = (e) => {
    props.deleteLandmark(landmark)
  }
  return (
    <WRow className='table-entry'>
      <WCol size='11'>
        {editingName ? (
          <WInput
            className='table-input'
            onBlur={handleNameEdit}
            autoFocus={true}
            defaultValue={landmark}
            type='text'
            wtype='outlined'
            baranimation='solid'
            inputclass='table-input-class'
          />
        ) : (
          <div className='table-text'>{landmark}</div>
        )}
      </WCol>
      {editing ? (
        <WCol size='1'>
          <WRow>
            <WCol size='1'>
              <WButton
                className='name-text'
                wType='texted'
                onClick={handleDeleteLandmark}
              >
                <i className='name-button material-icons'>close</i>
              </WButton>
            </WCol>
            <WCol size='1'>
              <WButton
                className='name-text'
                onClick={() => toggleNameEdit(!editingName)}
              >
                <i className='name-button material-icons'>mode_edit</i>
              </WButton>
            </WCol>
          </WRow>
        </WCol>
      ) : (
        <div className='table-text'></div>
      )}
    </WRow>
  )
}

export default LandmarkEntry
