import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_MAP, DELETE_MAP } from '../../cache/mutations'
import { RENAME_MAP } from '../../cache/mutations'
import NavbarOptions from '../navbar/NavbarOptions'
import MapList from '../maps/MapList'
import globe from '../../images/globe.png'
import CreateMap from '../homescreen/CreateMap'
import { GET_DB_MAPS } from '../../cache/queries'
import { WRow, WCol, WCard, WButton, WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain } from 'wt-frontend'

const HomeScreen = (props) => {
  let maps = []
  const [showCreateMap, toggleShowCreateMap] = useState(false)
  const [AddMap] = useMutation(ADD_MAP)
  const [DeleteMap] = useMutation(DELETE_MAP)
  const [RenameMap] = useMutation(RENAME_MAP)
  const { loading, error, data, refetch } = useQuery(GET_DB_MAPS)

  if (loading) {
    console.log(loading, 'loading')
  }
  if (error) {
    console.log(error, 'error')
  }
  if (data) {
    for (let map of data.getAllMaps) {
      maps.push(map)
    }
  }
  const setShowCreateMap = async (e) => {
    toggleShowCreateMap(false)
    toggleShowCreateMap(!showCreateMap)
  }

  const createNewMap = async (name) => {
    const { data } = await AddMap({
      variables: {
        name: name,
        owner: props.user._id,
      },
      refetchQueries: [{ query: GET_DB_MAPS }],
    })
  }

  const deleteMap = async (_id) => {
    const { data } = await DeleteMap({
      variables: {
        _id: _id,
      },
      refetchQueries: [{ query: GET_DB_MAPS }],
    })
  }

  const renameMap = async (value, _id) => {
    const { data } = await RenameMap({
      variables: {
        name: value,
        _id: _id,
      },
      refetchQueries: [{ query: GET_DB_MAPS }],
    })
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
              // reloadMaps={refetch}
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
                    <div className='map-entries maps-list-container'>
                      <MapList
                        renameMap={renameMap}
                        deleteMap={deleteMap}
                        maps={maps}
                      ></MapList>
                    </div>
                  </div>
                </WCol>
                <WCol size='6'>
                  <div className='maps-right'>
                    <div className='maps-image-container'>
                      <img className='center' src={globe}></img>
                    </div>
                    <WButton
                      onClick={setShowCreateMap}
                      className='create-map-btn'
                    >
                      Create Map
                    </WButton>
                  </div>
                </WCol>
              </WRow>
            </div>
          </WCard>
        </div>
      </WLMain>

      {showCreateMap && (
        <CreateMap
          fetchUser={props.fetchUser}
          user={props.user}
          setShowCreateMap={setShowCreateMap}
          createNewMap={createNewMap}
        />
      )}
    </WLayout>
  )
}

export default HomeScreen
