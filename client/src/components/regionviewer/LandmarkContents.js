import React from 'react'
import LandmarkEntry from './LandmarkEntry'

const LandmarkContents = (props) => {
  let landmarks = props.landmarks

  return landmarks !== undefined && landmarks.length > 0 ? (
    <div className=' table-entries container-primary'>
      {landmarks.map((landmark, index) => (
        <LandmarkEntry
          landmark={landmark}
          deleteLandmark={props.deleteLandmark}
          key={index}
          editable={props.editable}
        />
      ))}
    </div>
  ) : (
    <div className='container-primary'></div>
  )
}

export default LandmarkContents
