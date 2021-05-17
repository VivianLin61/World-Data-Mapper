import React, { useState } from 'react'
import { WButton, WInput, WRow, WCol } from 'wt-frontend'
import { useHistory } from 'react-router-dom'
import Hotkeys from 'react-hot-keys'

const TableEntry = (props) => {
  let history = useHistory()

  const importAllFlags = (dir) => {
    let flags = {}
    dir.keys().map((flag, index) => {
      flags[flag.replace('./', '')] = dir(flag)
    })
    return flags
  }

  const flags = importAllFlags(
    require.context('./The World', false, /\.(png|jpe?g|svg)$/)
  )

  // console.log(flags)

  const thisFlag = flags[props.data.name + ' Flag.png']

  const { data } = props
  const name = data.name
  const capital = data.capital
  const leader = data.leader
  const landmarks =
    data.landmarks.length === 0 ? 'No Landmarks' : data.landmarks

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
      ancestors: props.ancestors,
      ids: props.ids,
    })
  }
  const handleDeleteRegion = (e) => {
    props.showDeleteRegionModal({
      region: data,
      regionId: data._id,
      index: props.index,
    })
  }

  const handleNavigate = (field) => {
    if (field == 'name') {
      editingName(true)
      editingCapital(false)
      editingLeader(false)
    }
    if (field == 'capital') {
      editingName(false)
      editingCapital(true)
      editingLeader(false)
    }
    if (field == 'leader') {
      editingName(false)
      editingCapital(false)
      editingLeader(true)
    }
    console.log('here')
  }
  return (
    <WRow className='table-entry'>
      <WCol size='2'>
        <Hotkeys
          keyName='LeftArrow'
          onKeyDown={() => handleNavigate('name')}
        ></Hotkeys>
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
        <div className='table-text'>
          <img alt='no-flag' className='spreadsheet-flag' src={thisFlag} />
        </div>
      </WCol>
      <WCol size='4'>
        <div className='table-text' onClick={goToRegionViewer}>
          {landmarks.toString()}
        </div>
      </WCol>
    </WRow>
  )
}

export default TableEntry
