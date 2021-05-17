import React, { useState, useEffect } from 'react'
import TableEntry from './TableEntry'

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false)

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  })

  return keyPressed
}

const TableContents = (props) => {
  // useEffect(() => {
  //   document.addEventListener('keydown', navigateUpAndDown, false)
  //   return () => {
  //     document.removeEventListener('keydown', navigateUpAndDown, false)
  //   }
  // })
  let entries = props.regions
  let entryCount = 0
  if (entries) {
    entries = entries.filter((entry) => entry !== null)
    entryCount = entries.length
  }
  const [activeField, setActiveField] = useState('')
  const [activeIndex, setActiveIndex] = useState()
  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const [cursor, setCursor] = useState(-1)

  useEffect(() => {
    if (entries.length && downPress && activeField) {
      setCursor((prevState) =>
        prevState < entries.length - 1 ? prevState + 1 : prevState
      )
    }
  }, [downPress])
  useEffect(() => {
    if (entries.length && upPress && activeField) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState))
    }
  }, [upPress])

  const navigateUpAndDown = (index, field) => {
    // console.log(dir, field, index)
    // var newIndex = index + dir
    // if (newIndex < 0) {
    //   newIndex = 0
    // }
    // if (newIndex > entries.length - 1) {
    //   newIndex = entries.length - 1
    // }
    setCursor(index)
    setActiveField(field)
    // setActiveIndex(0)
  }

  return entries !== undefined && entries.length > 0 ? (
    <div className=' table-entries container-primary'>
      {entries.map((entry, index) => (
        <TableEntry
          data={entry}
          key={entry._id}
          index={index}
          url={props.url}
          entryCount={entryCount}
          deleteRegion={props.deleteRegion}
          editRegion={props.editRegion}
          showDeleteRegionModal={props.showDeleteRegionModal}
          ancestors={props.ancestors}
          ids={props.ids}
          navigateUpAndDown={navigateUpAndDown}
          activeField={activeField}
          active={index === cursor}
          parent={props.parent}
          setCursor={setCursor}
          setActiveField={setActiveField}
        />
      ))}
    </div>
  ) : (
    <div className='container-primary'>
      {/* {props.activeList._id ? (
        <h2 className='nothing-msg'> Nothing to do!</h2>
      ) : (
        <></>
      )} */}
    </div>
  )
}

export default TableContents
