import React from 'react'
import MapEntry from './MapEntry'

const MapList = (props) => {
  let tempID = 0
  return (
    <>
      {props.listIDs &&
        props.listIDs.map((entry) => (
          <MapEntry
          // handleSetActive={props.handleSetActive}
          // activeid={props.activeid}
          // id={tempID++}
          // key={entry._id + props.activeid}
          // name={entry.name}
          // _id={entry._id}
          // updateListField={props.updateListField}
          />
        ))}
    </>
  )
}

export default MapList
