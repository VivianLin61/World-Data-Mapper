import React from 'react'
import TableEntry from './TableEntry'

const TableContents = (props) => {
  let entries = props.regions
  let entryCount = 0
  if (entries) {
    entries = entries.filter((entry) => entry !== null)
    entryCount = entries.length
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
          // reorderItem={props.reorderItem}
          // editItem={props.editItem}
          parent={props.parent}
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
