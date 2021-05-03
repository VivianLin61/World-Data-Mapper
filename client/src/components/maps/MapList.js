import React from 'react'
import MapEntry from './MapEntry'

const MapList = (props) => {
  let tempID = 0
  return (
    <>
      {props.maps &&
        props.maps.map((entry) => (
          <MapEntry
            renameMap={props.renameMap}
            deleteMap={props.deleteMap}
            key={tempID++}
            data={entry}
            name={entry.name}
            _id={entry._id}
          />
        ))}
    </>
  )
}

export default MapList
