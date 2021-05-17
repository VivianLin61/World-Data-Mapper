import React, { useState, useEffect } from 'react'
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
  // const handleNavigationUpAndDown = (field) => {
  //   if (field == 'name') {
  //     toggleNameEdit(true)
  //   } else if (field == 'capital') {
  //     toggleCapitalEdit(true)
  //   } else if (field == 'ledaer') {
  //     toggleLeaderEdit(true)
  //   }
  // }
  // if (props.activeField) {
  //   handleNavigationUpAndDown(props.activeField)
  // }

  if (props.active) {
    console.log(props.index)
    console.log(props.activeField)
  }

  const handleNameEdit = (e) => {
    toggleNameEdit(false)
    const newName = e.target.value ? e.target.value : 'No Name'
    const prevName = name
    if (newName !== prevName) {
      props.editRegion(data._id, 'name', newName, prevName)
    }
    props.setActiveField('')
    props.setCursor(-1)
  }

  const handleCapitalEdit = (e) => {
    toggleCapitalEdit(false)
    const newCapital = e.target.value ? e.target.value : 'No Capital'
    const prevCapital = capital
    if (newCapital !== prevCapital) {
      props.editRegion(data._id, 'capital', newCapital, prevCapital)
    }
    props.setActiveField('')
    props.setCursor(-1)
  }

  const handleLeaderEdit = (e) => {
    toggleLeaderEdit(false)
    const newLeader = e.target.value ? e.target.value : 'No Leader'
    const prevLeader = leader
    if (newLeader !== prevLeader) {
      props.editRegion(data._id, 'leader', newLeader, prevLeader)
    }
    props.setActiveField('')
    props.setCursor(-1)
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

  const handleEditing = (field) => {
    if (field == 'name') {
      props.navigateUpAndDown(props.index, 'name')
      // props.setCursor(props.index)
      // props.setActiveField('name')
    }
  }
  const handleNavigate = (field) => {
    if (field == 'name') {
      toggleNameEdit(true)
      toggleCapitalEdit(false)
      toggleLeaderEdit(false)
    }
    if (field == 'capital') {
      toggleNameEdit(false)
      toggleCapitalEdit(true)
      toggleLeaderEdit(false)
    }
    if (field == 'leader') {
      toggleNameEdit(false)
      toggleCapitalEdit(false)
      toggleLeaderEdit(true)
    }
  }

  const editNavigation = (e) => {
    if (e.key == 'ArrowLeft') {
      if (editingCapital || (props.active && props.activeField == 'capital')) {
        handleNavigate('name')
      } else if (
        editingLeader ||
        (props.active && props.activeField == 'leader')
      ) {
        handleNavigate('capital')
      }
    } else if (e.key == 'ArrowRight') {
      if (editingName || (props.active && props.activeField == 'name')) {
        console.log('navigate')
        handleNavigate('capital')
      } else if (
        editingCapital ||
        (props.active && props.activeField == 'capital')
      ) {
        handleNavigate('leader')
      }
    }
    // } else if (e.key === 'ArrowDown') {
    //   if (editingCapital || (props.active && props.activeField == 'capital')) {
    //     // props.navigateUpAndDown(e, 1, 'capital', props.index)
    //   } else if (editingName || (props.active && props.activeField == 'name')) {
    //     props.navigateUpAndDown(e, 1, 'name', props.index)
    //   } else if (
    //     editingLeader ||
    //     (props.active && props.activeField == 'leader')
    //   ) {
    //     props.navigateUpAndDown(e, 1, 'leader', props.index)
    //   }
    // } else if (e.key === 'ArrowUp') {
    //   if (editingCapital) {
    //     props.navigateUpAndDown(e, -1, 'capital', props.index)
    //   } else if (editingName) {
    //     props.navigateUpAndDown(e, -1, 'name', props.index)
    //   } else if (editingLeader) {
    //     props.navigateUpAndDown(e, -1, 'leader', props.index)
    //   }
    // }
  }
  useEffect(() => {
    document.addEventListener('keydown', editNavigation, false)
    return () => {
      document.removeEventListener('keydown', editNavigation, false)
    }
  })

  return (
    <WRow className='table-entry'>
      <WCol size='2'>
        {editingName || props.active ? (
          <WInput
            className={'table-input'}
            onBlur={handleNameEdit}
            autoFocus={true}
            defaultValue={name}
            type='text'
            wtype='outlined'
            baranimation='solid'
            inputclass='table-input-class'
          />
        ) : (
          <div className={'table-text'} onClick={goToSubRegion}>
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
              onClick={() => {
                toggleNameEdit(!editingName)
                handleEditing('name')
              }}
            >
              <i className='name-button material-icons'>mode_edit</i>
            </WButton>
          </WCol>
        </WRow>
      </WCol>
      <WCol size='2'>
        {editingCapital ||
        (props.active && props.activeField == 'capital') ||
        capital === '' ? (
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
        {editingLeader || (props.active && props.activeField == 'leader') ? (
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
        <div>
          <img
            style={{ height: '40px' }}
            alt='no-flag'
            className='spreadsheet-flag'
            src={thisFlag}
          />
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
