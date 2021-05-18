import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import NavbarOptions from '../navbar/NavbarOptions'
import MainContents from '../regionspreedsheet/MainContents'
import DeleteRegion from '../modals/DeleteRegion'
import Ancestor from '../regionspreedsheet/Ancestor'
import { WButton, WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WCard } from 'wt-frontend'
import {
  ADD_SUBREGION,
  DELETE_SUBREGION,
  UPDATE_SUBREGION,
  SORT_REGIONS,
} from '../../cache/mutations.js'
import { GET_ANCESTORS, GET_DB_REGIONS } from '../../cache/queries'
import { useHistory } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'
import {
  UpdateRegion_Transaction,
  EditRegion_Transaction,
  SortRegions_Transaction,
} from '../../utils/jsTPS'

const RegionSpreadSheet = (props) => {
  let history = useHistory()
  var regions = []
  var ancestors = []

  let ids = props.location.pathname.split('/')
  ids.splice(0, 2)

  const [showDeleteRegion, toggleShowDeleteRegion] = useState(false)
  const [regionToDeleteParams, setRegionToDeleteParams] = useState({})
  // const [updateParent, setUpdateParent] = useState(null)

  const setShowDeleteRegion = async (e) => {
    toggleShowDeleteRegion(false)
    toggleShowDeleteRegion(!showDeleteRegion)
  }

  const showDeleteRegionModal = async (regionParams) => {
    setRegionToDeleteParams({ regionParams })
    setShowDeleteRegion(false)
  }

  //#region QUERY REGIONS
  const {
    loading: loadingAll,
    error: errorAll,
    data: dataAll,
    refetch: refetchAll,
  } = useQuery(GET_DB_REGIONS, {
    variables: { ids },
  })

  if (loadingAll) {
    console.log(loadingAll, 'loading all')
  }
  if (errorAll) {
    console.log(errorAll, 'error loading all')
  }

  if (dataAll) {
    for (let region of dataAll.getAllRegions) {
      regions.push(region)
    }
  }
  //#endregion

  //#region QUERY ANCESTORS
  const {
    loading: loadingAncestors,
    error: errorAncestors,
    data: dataAncestors,
    refetch: refetchAncestors,
  } = useQuery(GET_ANCESTORS, {
    variables: { ids: ids },
  })
  if (loadingAncestors) {
    console.log(loadingAncestors, 'loading ancestors')
  }
  if (errorAncestors) {
    console.log(errorAncestors, 'error loading ancestors')
  }
  if (dataAncestors) {
    ancestors = dataAncestors.getAncestors
  }
  //#endregion
  const mutationOptions = {
    refetchQueries: [
      { query: GET_DB_REGIONS, variables: { ids } },
      { query: GET_ANCESTORS, variables: { ids } },
    ],
    awaitRefetchQueries: true,
  }

  const [AddSubRegion] = useMutation(ADD_SUBREGION, mutationOptions)
  const [DeleteSubRegion] = useMutation(DELETE_SUBREGION, mutationOptions)
  const [UpdateRegionField] = useMutation(UPDATE_SUBREGION, mutationOptions)
  const [SortRegions] = useMutation(SORT_REGIONS, mutationOptions)
  //#region UNDO REDO

  useEffect(() => {
    document.addEventListener('keyup', keyboardUndoRedo, false)
    return () => {
      document.removeEventListener('keyup', keyboardUndoRedo, false)
    }
  })

  useEffect(() => {
    refetchAll()
    refetchAncestors()
  }, [props.location])

  const keyboardUndoRedo = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      tpsUndo()
    } else if (e.ctrlKey && e.key === 'y') {
      tpsRedo()
    }
  }

  const tpsUndo = async () => {
    const ret = await props.tps.undoTransaction()
    if (props.tps.getUndoSize() === 0) {
      document
        .getElementsByClassName('undo-button')[0]
        .classList.add('disable-list-item-control')
    }
    enableRedo()
    return ret
  }

  const tpsRedo = async () => {
    const ret = await props.tps.doTransaction()
    if (props.tps.getRedoSize() === 0) {
      document
        .getElementsByClassName('redo-button')[0]
        .classList.add('disable-list-item-control')
    }
    enableUndo()
    return ret
  }
  //#endregion
  const refetchRegionsAndAncestor = async (prevIds, deleteId) => {
    await DeleteSubRegion({
      variables: { regionId: deleteId, ids: prevIds, index: 0 },
    })
    refetchAll()
    // const { data: RRData } = await refetchAll()
    // if (RRData) {
    //   let newRegions = []
    //   for (let region of RRData.getAllRegions) {
    //     newRegions.push(region)
    //   }
    //   regions = newRegions
    // }
  }

  if (props.location.state.refetch) {
    let prevIds = props.location.state.ids
    let deleteId = props.location.state.regionId

    refetchRegionsAndAncestor(prevIds, deleteId)
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
    enableUndo()
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
    enableUndo()
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
    enableUndo()
  }
  const sort = async (criteria) => {
    let transaction = new SortRegions_Transaction(ids, criteria, SortRegions)
    props.tps.addTransaction(transaction)
    tpsRedo()
    enableUndo()
  }
  const navigateToAncestorRegion = (region, index) => {
    let path = props.match.url
    path = path.split('/')
    path = path.splice(0, 2)
    for (let i = 0; i < ids.length; i++) {
      if (i === index + 1) {
        break
      }
      path.push(ids[i])
    }
    path = path.toString()
    path = path.replaceAll(',', '/')
    history.push(path, {
      data: region,
    })
  }
  const enableUndo = () => {
    console.log('remove undo')
    document
      .getElementsByClassName('undo-button')[0]
      .classList.remove('disable-list-item-control')
  }
  const enableRedo = () => {
    document
      .getElementsByClassName('redo-button')[0]
      .classList.remove('disable-list-item-control')
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
                    <WButton
                      className={'undo-button disable-list-item-control'}
                      onClick={tpsUndo}
                    >
                      <i className='material-icons'>undo</i>
                    </WButton>
                    <WButton
                      className={'redo-button disable-list-item-control'}
                    >
                      <i className='material-icons' onClick={tpsRedo}>
                        redo
                      </i>
                    </WButton>
                    <div>
                      Region Name:{' '}
                      {props.location.state.data.name
                        ? props.location.state.data.name
                        : ''}
                    </div>
                  </WLHeader>
                  <div className='regions'>
                    <MainContents
                      regions={regions}
                      url={props.match.url}
                      parent={
                        props.location.state.data
                          ? props.location.state.data
                          : {}
                      }
                      ancestors={ancestors}
                      deleteRegion={deleteRegion}
                      editRegion={editRegion}
                      showDeleteRegionModal={showDeleteRegionModal}
                      ids={ids}
                      sort={sort}
                      // editBelow={editBelow}
                      // editAbove={editAbove}
                    />
                  </div>
                </WCard>
              </div>
            </WLMain>

            {showDeleteRegion && (
              <DeleteRegion
                deleteRegion={deleteRegion}
                regionToDeleteParams={regionToDeleteParams}
                setShowDeleteRegion={setShowDeleteRegion}
              />
            )}
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
              refetch={refetchAll}
            />
          )}
        />
      </Switch>
    </>
  )
}
export default RegionSpreadSheet
