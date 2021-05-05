import React from 'react'
import TableHeader from './TableHeader'
import TableContents from './TableContents'

const MainContents = (props) => {
  return (
    <div className='table '>
      <TableHeader
      // undo={props.undo}
      // redo={props.redo}
      // canUndo={props.canUndo}
      // canRedo={props.canRedo}      // sort={props.sort}
      />
      <TableContents
        // key={props.activeList._id}
        regions={props.regions}
        url={props.url}
        parent={props.parent}
        deleteRegion={props.deleteRegion}
        editRegion={props.editRegion}
        // deleteItem={props.deleteItem}
        // reorderItem={props.reorderItem}
        // editItem={props.editItem}
      />
    </div>
  )
}

export default MainContents
