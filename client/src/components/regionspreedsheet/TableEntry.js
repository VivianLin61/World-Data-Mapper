import React, { useState } from 'react'
import { WButton, WInput, WRow, WCol } from 'wt-frontend'
import { useHistory, Link } from 'react-router-dom'

const TableEntry = (props) => {
  let history = useHistory()
  const { data } = props

  const name = data.name
  const capital = data.capital
  const leader = data.leader
  const landmarks = data.landmarks.length == 0 ? 'No Landmarks' : data.landmarks

  const [editingName, toggleNameEdit] = useState(false)
  const [editingCapital, toggleCapitalEdit] = useState(false)
  const [editingLeader, toggleLeaderEdit] = useState(false)

  const handleNameEdit = (e) => {
    toggleNameEdit(false)
    const newName = e.target.value ? e.target.value : 'No Name'
    const prevName = name
    if (newName !== prevName) {
      props.editRegion(data._id, 'name', newName, prevName)
    }
  }

  const handleCapitalEdit = (e) => {
    toggleCapitalEdit(false)
    const newCapital = e.target.value ? e.target.value : 'No Capital'
    const prevCapital = capital
    if (newCapital !== prevCapital) {
      props.editRegion(data._id, 'capital', newCapital, prevCapital)
    }
  }

  const handleLeaderEdit = (e) => {
    toggleLeaderEdit(false)
    const newLeader = e.target.value ? e.target.value : 'No Leader'
    const prevLeader = leader
    if (newLeader !== prevLeader) {
      props.editRegion(data._id, 'leader', newLeader, prevLeader)
    }
  }

  const goToSubRegion = (e) => {
    history.push(`${props.url}/${props.data._id}`, { data: data })
  }

  const goToRegionViewer = (e) => {
    history.push(`/regionviewer/${props.data._id}`, {
      data: data,
      parent: props.parent,
      url: props.url,
    })
  }
  const handleDeleteRegion = (e) => {
    props.deleteRegion(data, data._id, props.index)
  }
  return (
    <WRow className='table-entry'>
      <WCol size='2'>
        {editingName ? (
          <WInput
            className='table-input'
            onBlur={handleNameEdit}
            autoFocus={true}
            defaultValue={name}
            type='text'
            wtype='outlined'
            baranimation='solid'
            inputclass='table-input-class'
          />
        ) : (
          <div className='table-text' onClick={goToSubRegion}>
            {name}
          </div>
        )}
      </WCol>
      <WCol size='1'>
        <WRow>
          <WCol size='1'>
            <WButton
              className='name-text'
              wType='texted'
              onClick={handleDeleteRegion}
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
      <WCol size='2'>
        {editingCapital || capital === '' ? (
          <WInput
            className='table-input'
            onBlur={handleCapitalEdit}
            onKeyDown={(e) => {
              if (e.keyCode === 13) handleCapitalEdit(e)
            }}
            autoFocus={true}
            defaultValue={capital}
            type='text'
            inputClass='table-input-class'
          />
        ) : (
          <div
            className='table-text'
            onDoubleClick={() => toggleCapitalEdit(!editingCapital)}
          >
            {capital}
          </div>
        )}
      </WCol>

      <WCol size='2'>
        {editingLeader ? (
          <WInput
            className='table-input'
            onBlur={handleLeaderEdit}
            autoFocus={true}
            defaultValue={leader}
            type='text'
            wtype='outlined'
            baranimation='solid'
            inputclass='table-input-class'
          />
        ) : (
          <div
            className='table-text'
            onDoubleClick={() => toggleLeaderEdit(!editingLeader)}
          >
            {leader}
          </div>
        )}
      </WCol>
      <WCol size='1'>
        <div className='table-text'>No Flag</div>
      </WCol>
      <WCol size='4'>
        <div className='table-text' onClick={goToRegionViewer}>
          {landmarks}
        </div>
      </WCol>
    </WRow>
  )
}

export default TableEntry
