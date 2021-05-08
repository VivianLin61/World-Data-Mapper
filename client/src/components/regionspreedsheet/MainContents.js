import React from 'react'
import TableHeader from './TableHeader'
import TableContents from './TableContents'

const MainContents = (props) => {
  return (
    <div className='table '>
      <TableHeader sort={props.sort} />
      <TableContents
        regions={props.regions}
        url={props.url}
        ancestors={props.ancestors}
        parent={props.parent}
        deleteRegion={props.deleteRegion}
        editRegion={props.editRegion}
        showDeleteRegionModal={props.showDeleteRegionModal}
        ids={props.ids}
      />
    </div>
  )
}

export default MainContents
