import React from 'react'
import Ancestor from '../regionspreedsheet/Ancestor'
import NavbarOptions from '../navbar/NavbarOptions'
import { useHistory } from 'react-router-dom'
import {
  WLMain,
  WRow,
  WButton,
  WCol,
  WCard,
  WLayout,
  WLHeader,
  WNavbar,
  WNavItem,
} from 'wt-frontend'
import WInput from 'wt-frontend/build/components/winput/WInput'

const RegionViewer = (props) => {
  let history = useHistory()
  let data = props.location.state.data
  let parent = props.location.state.parent
  let ancestors = props.location.state.ancestors
  let url = props.location.state.url
  let ids = props.location.state.ids
  let prevSibling
  let nextSibling
  ids.push(data._id)
  ancestors = [...ancestors, parent]
  if (parent.subregions) {
    let indexOfChild = parent.subregions.findIndex(
      (region) => region._id == ids[ids.length - 1]
    )
    if (indexOfChild > 0) {
      prevSibling = parent.subregions[indexOfChild - 1]
    }
    if (indexOfChild < parent.subregions.length - 1) {
      nextSibling = parent.subregions[indexOfChild + 1]
    }
  }

  const handleAddLankmark = (e) => {
    console.log('add landmark')
  }

  const navigateBackToRegionSpreadshhet = (e) => {
    history.push(`${props.location.state.url}/${parent._id}`, { data: parent })
  }

  const navigateToAncestorRegion = (region, index) => {
    let path = url
    path = path.split('/')
    path = path.splice(0, 2)
    for (let i = 0; i < ids.length; i++) {
      if (i == index + 1) {
        break
      }
      path.push(ids[i])
    }
    path = path.toString()
    path = path.replaceAll(',', '/')
    history.push(path, { data: region })
  }
  const goToNextSibling = (e) => {
    // if (nextSibling) {
    //   let path = url
    //   path = path.split('/')
    //   path.push(nextSibling._id)
    //   path = path.toString()
    //   path = path.replaceAll(',', '/')
    //   // history.push(path, { data: nextSibling })
    //   history.push(`/regionviewer/${data._id}`, {
    //     data: data,
    //     parent: parent,
    //     url: url,
    //     ancestors: ancestors,
    //     ids: ids,
    //   })
    // }
  }

  const goToPreviousSibling = (e) => {
    // if (prevSibling) {
    //   let path = url
    //   path = path.split('/')
    //   path.push(prevSibling._id)
    //   path = path.toString()
    //   path = path.replaceAll(',', '/')
    //   history.push(path, { data: prevSibling })
    // }
  }

  return (
    <WLayout wLayout='header'>
      <WLHeader>
        <WNavbar color='colored'>
          <ul>
            <WNavItem>
              <WButton
                className='logo'
                wType='texted'
                hoverAnimation='text-primary'
                onClick={() => history.push(`/home`, { user: props.user })}
              >
                World Data Mapper
              </WButton>
            </WNavItem>
            {ancestors.map((entry, index) => (
              <Ancestor
                data={entry}
                key={index}
                name={entry.name}
                index={index}
                navigateToAncestorRegion={navigateToAncestorRegion}
              />
            ))}
          </ul>
          <ul>
            <WNavItem>
              <WButton onClick={goToPreviousSibling} className={'arrow-back'}>
                <i className='arrows material-icons'>arrow_back</i>
              </WButton>
            </WNavItem>
            <WNavItem>
              <WButton onClick={goToNextSibling} className={'arrow-forward'}>
                <i className='arrows material-icons'>arrow_forward</i>
              </WButton>
            </WNavItem>
            <NavbarOptions
              fetchUser={props.fetchUser}
              auth={true}
              user={props.user}
              setShowCreate={false}
              setShowLogin={true}
            />
          </ul>
        </WNavbar>
      </WLHeader>
      <WLMain>
        <div>
          <WCard className='viewer-container' wLayout='header-content'>
            <WLHeader className='viewer-header'>
              <WButton className={'undo-button'}>
                <i className='material-icons'>undo</i>
              </WButton>
              <WButton className={'redo-button'}>
                <i className='material-icons'>redo</i>
              </WButton>
              <div className='region-landmarks-text'>Regional Landmarks:</div>
            </WLHeader>
            <div className='viewer-details'>
              <WRow>
                <WCol size='6'>
                  <div className='viewer-left'>
                    <div className='region-flag-container'></div>
                    <div className='region-details-container'>
                      <div className='region-details'>
                        Region Name: {data.name}
                      </div>
                      <div
                        className='region-details'
                        style={{ cursor: 'pointer', color: 'var(--baby-blue)' }}
                        onClick={navigateBackToRegionSpreadshhet}
                      >
                        Parent Region: {parent.name}
                      </div>
                      <div className='region-details'>
                        Region Captial: {data.capital}
                      </div>
                      <div className='region-details'>
                        Region Leader: {data.leader}
                      </div>
                      <div className='region-details'>
                        # of Sub Regions:{' '}
                        {data.subregions ? data.subregions.length : 0}
                      </div>
                    </div>
                  </div>
                </WCol>
                <WCol size='6'>
                  <div className='viewer-right'>
                    <div className='landmarks-list-container'>
                      {/* <img className='center' src={globe}></img> */}
                    </div>
                    <div className='add-landmark'>
                      <WRow style={{ height: '100%' }}>
                        <WCol size='1' style={{ backgroundColor: 'gray' }}>
                          <WButton
                            className={'add-landmark-button'}
                            onClick={handleAddLankmark}
                          >
                            <i className='material-icons add-landmark-icon'>
                              add
                            </i>
                          </WButton>
                        </WCol>
                        <WCol size='11'>
                          <WInput className='landmark-input'></WInput>
                        </WCol>
                      </WRow>
                    </div>
                  </div>
                </WCol>
              </WRow>
            </div>
          </WCard>
        </div>
      </WLMain>
    </WLayout>
  )
}

export default RegionViewer
