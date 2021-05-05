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
            showDeleteModal={props.showDeleteModal}
            key={tempID++}
            data={entry}
            name={entry.name}
            _id={entry._id}
            setShowDeleteMap={props.setShowDeleteMap}
          />
        ))}
    </>
  )
}

export default MapList
