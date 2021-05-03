import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import NavbarOptions from '../navbar/NavbarOptions'
import MainContents from '../regionspreedsheet/MainContents'
import { WButton, WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WCard } from 'wt-frontend'
import { ADD_SUBREGION } from '../../cache/mutations.js'
import { GET_DB_REGIONS } from '../../cache/queries'
import { useHistory } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'

const RegionSpreadSheet = (props) => {
  let history = useHistory()
  let regions = []
  const [AddSubRegion] = useMutation(ADD_SUBREGION)
  let ids = props.location.pathname.split('/')
  ids.splice(0, 2)
  const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS, {
    variables: { ids },
  })

  if (loading) {
    console.log(loading, 'loading')
  }
  if (error) {
    console.log(error, 'error')
  }
  if (data) {
    for (let region of data.getAllRegions) {
      regions.push(region)
    }
  }

  const handleAddSubRegion = async (e) => {
    const region = {
      _id: '',
      name: 'No Name',
      capital: 'No Capial',
      leader: 'No Leader',
      parentId: ids[ids.length - 1],
      mapId: ids[0],
      landmarks: [],
      subregions: [],
    }
    const { data } = await AddSubRegion({
      variables: {
        region: region,
        ids: ids,
        index: -1,
      },
      refetchQueries: [{ query: GET_DB_REGIONS, variables: { ids } }],
    })
    // let transaction = new UpdateListItems_Transaction(
    //   listID,
    //   itemID,
    //   newItem,
    //   opcode,
    //   AddTodoItem,
    //   DeleteTodoItem
    // )
    // props.tps.addTransaction(transaction)
    // tpsRedo()
  }

  const addSubRegion = async () => {}

  return (
    <>
      {props.match.isExact && (
        <>
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
                <WCard className='regions-container' wLayout='header-content'>
                  <WLHeader className='region-header'>
                    <WButton
                      className={'add-button'}
                      onClick={handleAddSubRegion}
                    >
                      <i className='material-icons'>add</i>
                    </WButton>
                    <WButton className={'undo-button'}>
                      <i className='material-icons'>undo</i>
                    </WButton>
                    <WButton className={'redo-button'}>
                      <i className='material-icons'>redo</i>
                    </WButton>
                    <div>Region Name: {props.location.state.data.name}</div>
                  </WLHeader>
                  <div className='regions'>
                    <MainContents
                      addSubregion={addSubRegion}
                      regions={regions}
                      url={props.match.url}
                      parent={props.location.state.data}
                      //   deleteItem={deleteItem}
                      //   editItem={editItem}
                      //   reorderItem={reorderItem}
                      //   setShowDelete={setShowDelete}
                      //   undo={tpsUndo}
                      //   redo={tpsRedo}
                      //   canUndo={canUndo}
                      //   canRedo={canRedo}
                      //   sort={sort}
                    />
                  </div>
                </WCard>
              </div>
            </WLMain>
          </WLayout>
        </>
      )}
      <Switch>
        <Route
          path={`${props.match.path}/:id`}
          render={({ match, location }) => (
            <RegionSpreadSheet
              fetchUser={props.fetchUser}
              user={props.user}
              match={match}
              location={location}
            />
          )}
        />
      </Switch>
    </>
  )
}

export default RegionSpreadSheet
