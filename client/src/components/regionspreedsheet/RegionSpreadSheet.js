import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import NavbarOptions from '../navbar/NavbarOptions'
import MainContents from '../regionspreedsheet/MainContents'
import { WButton, WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WCard } from 'wt-frontend'
import {
  ADD_SUBREGION,
  DELETE_SUBREGION,
  UPDATE_SUBREGION,
} from '../../cache/mutations.js'
import { GET_DB_REGIONS } from '../../cache/queries'
import { useHistory } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'
import {
  UpdateRegion_Transaction,
  EditRegion_Transaction,
} from '../../utils/jsTPS'

const RegionSpreadSheet = (props) => {
  let history = useHistory()
  let regions = []
  const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo())
  const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo())

  let ids = props.location.pathname.split('/')
  ids.splice(0, 2)
  //#region QUERY REGIONS
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

  const mutationOptions = {
    refetchQueries: [{ query: GET_DB_REGIONS, variables: { ids } }],
    awaitRefetchQueries: true,
  }
  //#endregion

  const [AddSubRegion] = useMutation(ADD_SUBREGION, mutationOptions)
  const [DeleteSubRegion] = useMutation(DELETE_SUBREGION, mutationOptions)
  const [UpdateRegionField] = useMutation(UPDATE_SUBREGION, mutationOptions)
  //#region UNDO REDO
  const tpsUndo = async () => {
    const ret = await props.tps.undoTransaction()
    if (ret) {
      setCanUndo(props.tps.hasTransactionToUndo())
      setCanRedo(props.tps.hasTransactionToRedo())
    }
  }

  const tpsRedo = async () => {
    const ret = await props.tps.doTransaction()
    if (ret) {
      setCanUndo(props.tps.hasTransactionToUndo())
      setCanRedo(props.tps.hasTransactionToRedo())
    }
  }
  //#endregion
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

    let opcode = 1
    let idPath = ids
    let regionId = region._id
    let transaction = new UpdateRegion_Transaction(
      idPath,
      regionId,
      region,
      opcode,
      AddSubRegion,
      DeleteSubRegion
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }
  const deleteRegion = async (region, id, index) => {
    const deletedRegion = {
      _id: region._id,
      name: region.name,
      capital: region.capital,
      leader: region.leader,
      parentId: ids[ids.length - 1],
      mapId: ids[0],
      landmarks: region.landmarks,
      subregions: region.subregions,
    }
    let opcode = 0
    let idPath = ids
    let regionId = id
    let transaction = new UpdateRegion_Transaction(
      idPath,
      regionId,
      deletedRegion,
      opcode,
      AddSubRegion,
      DeleteSubRegion,
      index
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

  const editRegion = async (regionId, field, value, prev) => {

    let transaction = new EditRegion_Transaction(
      ids,
      regionId,
      field,
      prev,
      value,
      UpdateRegionField
    )
    props.tps.addTransaction(transaction)
    tpsRedo()
  }

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
                      onClick={() =>
                        history.push(`/home`, { user: props.user })
                      }
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
                    <WButton className={'undo-button'} onClick={tpsUndo}>
                      <i className='material-icons'>undo</i>
                    </WButton>
                    <WButton className={'redo-button'}>
                      <i className='material-icons' onClick={tpsRedo}>
                        redo
                      </i>
                    </WButton>
                    <div>Region Name: {props.location.state.data.name}</div>
                  </WLHeader>
                  <div className='regions'>
                    <MainContents
                      regions={regions}
                      url={props.match.url}
                      parent={props.location.state.data}
                      deleteRegion={deleteRegion}
                      editRegion={editRegion}
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
              tps={props.tps}
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
