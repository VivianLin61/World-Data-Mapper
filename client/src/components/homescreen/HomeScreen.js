import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import NavbarOptions from '../navbar/NavbarOptions'
import MapContents from '../maps/MapContents'
import globe from '../../images/globe.png'
import { useHistory } from 'react-router-dom'
import {
  WRow,
  WCol,
  WLMain,
  WCard,
  WCFooter,
  WButton,
  WInput,
  WLayout,
  WLHeader,
  WNavbar,
  WNavItem,
} from 'wt-frontend'
import WLFooter from 'wt-frontend/build/components/wlayout/WLFooter'

const HomeScreen = (props) => {
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
          <WCard className='maps-container' wLayout='header-content'>
            <WLHeader className='maps-header'>Your Maps</WLHeader>
            <div className='maps'>
              <WRow>
                <WCol size='6'>
                  <div className='maps-table'>
                    <MapContents></MapContents>
                  </div>
                </WCol>
                <WCol size='6'>
                  <div className='maps-right' wLayout='content-footer'>
                    <div className='maps-image-container'>
                      <img className='center' src={globe}></img>
                    </div>
                    <WButton className='create-map-btn'>Create Map</WButton>
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

export default HomeScreen
