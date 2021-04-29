import React from 'react'
import MapEntry from './MapEntry'

const MapList = (props) => {
  console.log(props.mapIDs)
  let tempID = 0
  return (
    <>
      {props.mapIDs &&
        props.mapIDs.map((entry) => (
          <MapEntry
            createNewMap={props.createNewMap}
            key={tempID++}
            name={entry.name}
            _id={entry._id}
          />
        ))}
    </>
  )
}

export default MapList
