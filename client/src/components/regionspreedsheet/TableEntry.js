import React, { useState } from 'react'
import { WButton, WInput, WRow, WCol } from 'wt-frontend'

const TableEntry = (props) => {
  const { data } = props

  const name = data.name
  const capital = data.capital
  const leader = data.leader
  const landmarks = data.landmarks
  const [editingName, toggleNameEdit] = useState(false)
  const [editingCapital, toggleCapitalEdit] = useState(false)
  const [editingLeader, toggleLeaderEdit] = useState(false)

  const handleNameEdit = (e) => {
    toggleNameEdit(false)
    // const newDate = e.target.value ? e.target.value : 'No Date'
    // const prevDate = due_date
    // if (newDate !== prevDate) {
    //   props.editItem(data._id, 'due_date', newDate, prevDate)
    // }
  }

  const handleCapitalEdit = (e) => {
    // toggleCapitalEdit(false)
    // const newDescr = e.target.value ? e.target.value : 'No Description'
    // const prevDescr = description
    // if (newDescr !== prevDescr) {
    //   props.editItem(data._id, 'description', newDescr, prevDescr)
    // }
  }

  const handleLeaderEdit = (e) => {
    toggleLeaderEdit(false)
    // const newStatus = e.target.value ? e.target.value : false
    // const prevStatus = status
    // if (newStatus !== prevStatus) {
    //   props.editItem(data._id, 'completed', newStatus, prevStatus)
    // }
  }

  return (
    <WRow className='table-entry'>
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
            onClick={() => toggleCapitalEdit(!editingCapital)}
          >
            {capital}
          </div>
        )}
      </WCol>

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
          <div
            className='table-text'
            onClick={() => toggleNameEdit(!editingName)}
          >
            {name}
          </div>
        )}
      </WCol>
      <WCol size='2'>
        {editingLeader ? (
          <WInput
            className='table-input'
            onBlur={handleNameEdit}
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
            onClick={() => toggleNameEdit(!editingLeader)}
          >
            {leader}
          </div>
        )}
      </WCol>
      {/* <WCol size='2'>
        {editingLeader ? (
          <WInput
            className='table-input'
            onBlur={handleNameEdit}
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
            onClick={() => toggleNameEdit(!editingLeader)}
          >
            {leader}
          </div>
        )}
      </WCol> */}
      <WCol size='2'>
        <div className='table-text'>{landmarks}</div>
      </WCol>
    </WRow>
  )
}

export default TableEntry
