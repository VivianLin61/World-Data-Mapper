import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
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

  const navigateBackToRegionSpreadshhet = (e) => {
    history.push(`${props.location.state.url}/${parent._id}`, { data: parent })
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
                onClick={() => history.push('/home')}
              >
                World Data Mapper
              </WButton>
            </WNavItem>
          </ul>
          <ul>
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
                            // onClick={props.activeid ? disabledClick : props.createNewList}
                            // {...buttonOptions}
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
