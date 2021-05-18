import React, { useEffect, useState } from 'react'
import Ancestor from '../regionspreedsheet/Ancestor'
import { useQuery, useMutation } from '@apollo/client'
import { ADD_LANDMARK, DELETE_LANDMARK } from '../../cache/mutations.js'
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
import { GET_REGION, GET_LANDMARKS } from '../../cache/queries'
import { UPDATE_LANDMARK, CHANGE_PARENT } from '../../cache/mutations.js'
import LandmarkContents from '../regionviewer/LandmarkContents'
import {
  UpdateLandmark_Transaction,
  EditRegionLandmark_Transaction,
  ChangeParent_Transaction,
} from '../../utils/jsTPS'

import errorImg from '../../images/default.png'
const RegionViewer = (props) => {
  let history = useHistory()
  let data = props.location.state.data
  let parent
  let ancestors = props.location.state.ancestors
  let url = props.location.state.url
  let prevSibling
  let nextSibling
  let landmarks
  let editable
  let prevIds = props.location.state.ids
  let parents = []
  const [landmark, setLandmark] = useState('')
  const [editingParent, toggleParentEdit] = useState(false)
  const [ids, setIds] = useState(props.location.state.ids)
  const [prevParent, setPrevParent] = useState({})
  const [refetch, toggleRefecth] = useState(false)
  const mutationOptions = {
    refetchQueries: [
      { query: GET_LANDMARKS, variables: { ids: ids, regionId: data._id } },
      { query: GET_REGION, variables: { ids: ids } },
    ],
    awaitRefetchQueries: true,
  }

  const importAllFlags = (dir) => {
    let flags = {}
    dir.keys().map((flag, index) => {
      flags[flag.replace('./', '')] = dir(flag)
    })
    return flags
  }

  const flags = importAllFlags(
    require.context('./The World', false, /\.(png|jpe?g|svg)$/)
  )

  const thisFlag = flags[data.name + ' Flag.png']
  const [AddLandmark] = useMutation(ADD_LANDMARK, mutationOptions)
  const [DeleteLandmark] = useMutation(DELETE_LANDMARK, mutationOptions)
  const [UpdateLandmark] = useMutation(UPDATE_LANDMARK, mutationOptions)
  const [ChangeParent] = useMutation(CHANGE_PARENT, mutationOptions)
  useEffect(() => {
    refetchLandmarks()
    refetchParent()
  }, [props.location])
  //#region Get Landmarks
  const {
    loading,
    error,
    data: dataLandmarks,
    refetch: refetchLandmarks,
  } = useQuery(GET_LANDMARKS, {
    variables: { ids: ids, regionId: data._id },
  })

  if (loading) {
    console.log(loading, 'loading landmarks')
  }
  if (error) {
    console.log(error, 'error loading landmarks')
  }
  if (dataLandmarks) {
    let landmarkData = JSON.parse(dataLandmarks.getLandmarks)
    landmarks = landmarkData.landmarks
    landmarks = landmarks.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1]
    })
    editable = landmarkData.editable
  }
  //#endregion
  //#region UNDO REDO

  useEffect(() => {
    document.addEventListener('keyup', keyboardUndoRedo, false)
    return () => {
      document.removeEventListener('keyup', keyboardUndoRedo, false)
    }
  })

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

  //#region GET REGION
  const {
    loading: loadingParent,
    error: parentError,
    data: parentData,
    refetch: refetchParent,
  } = useQuery(GET_REGION, {
    variables: { ids: ids },
  })

  if (loadingParent) {
    console.log(loadingParent, 'loading ancestors')
  }
  if (parentError) {
    console.log(parentError, 'error loading ancestors')
  }
  if (parentData) {
    parent = parentData.getRegion

    if (parent) {
      ancestors = [...ancestors, parent]
      if (ancestors.length >= 2) {
        parents = ancestors[ancestors.length - 2].subregions
      }
      if (parent.subregions) {
        let indexOfChild = parent.subregions.findIndex(
          (region) => region._id === data._id
        )
        if (indexOfChild > 0) {
          prevSibling = parent.subregions[indexOfChild - 1]
        }
        if (indexOfChild < parent.subregions.length - 1) {
          nextSibling = parent.subregions[indexOfChild + 1]
        }
      }
    }
  }
  //#endregion

  const handleAddLankmark = async () => {
    if (landmarks.indexOf(landmark) == -1) {
      let opcode = 1
      let transaction = new UpdateLandmark_Transaction(
        ids,
        opcode,
        data._id,
        landmark,
        AddLandmark,
        DeleteLandmark
      )

      props.tps.addTransaction(transaction)
      tpsRedo()
      setLandmark('')
      document.getElementsByClassName('landmark-input')[0].firstChild.value = ''
      enableUndo()
    } else {
      alert('Landmark Already Exists')
    }
  }

  const handleDeleteLandmark = async (deletedLandmark) => {
    let opcode = 0
    let transaction = new UpdateLandmark_Transaction(
      ids,
      opcode,
      data._id,
      deletedLandmark,
      AddLandmark,
      DeleteLandmark
    )

    props.tps.addTransaction(transaction)
    tpsRedo()
    enableUndo()
  }

  const editRegionLandmark = (prev, value) => {
    if (prev != value) {
      let transaction = new EditRegionLandmark_Transaction(
        ids,
        data._id,
        prev,
        value,
        UpdateLandmark
      )
      props.tps.addTransaction(transaction)
      tpsRedo()
      enableUndo()
    }
  }

  const handleLandmarkEdit = (e) => {
    setLandmark(e.target.value)
  }
  const navigateBackToRegionSpreadshhet = (e) => {
    history.push(`${props.location.state.url}/${parent._id}`, {
      data: parent,
      refetch: true,
    })
  }
  const goToNextSibling = (e) => {
    if (nextSibling) {
      let path = url
      path = path.split('/')
      path.push(nextSibling._id)
      path = path.toString()
      path = path.replaceAll(',', '/')
      history.push(`/regionviewer/${nextSibling._id}`, {
        data: nextSibling,
        parent: parent,
        url: url,
        ancestors: ancestors.slice(0, ancestors.length - 1),
        ids: ids,
      })
    }
  }
  const goToPreviousSibling = (e) => {
    if (prevSibling) {
      let path = url
      path = path.split('/')
      path.push(prevSibling._id)
      path = path.toString()
      path = path.replaceAll(',', '/')
      history.push(`/regionviewer/${prevSibling._id}`, {
        data: prevSibling,
        parent: parent,
        url: url,
        ancestors: ancestors.slice(0, ancestors.length - 1),
        ids: ids,
      })
    }
  }

  const handleParentEdit = async (e) => {
    toggleParentEdit(false)

    const index = e.target.selectedIndex
    const newParent = parents[index]
    const prevParent = parent
    if (newParent._id != prevParent._id) {
      setPrevParent(parent)
      toggleRefecth(true)
      ids.pop()
      ids.push(newParent._id)
      setIds(ids)

      await ChangeParent({
        variables: {
          ids: prevIds,
          regionId: data._id,
          prevParentId: prevParent._id,
          newParentId: newParent._id,
        },
      })
    }
  }

  const navigateToAncestorRegion = (region, index) => {
    let path = url
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
    let temp = ids.splice(0, (ids.length = 1))
    temp = [...temp, prevParent._id]
    history.push(path, {
      data: region,
      refetch: refetch,
      ids: temp,
      regionId: data._id,
      prevParent: prevParent,
    })
  }

  const enableUndo = () => {
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
              <WButton
                onClick={goToPreviousSibling}
                className={prevSibling ? 'arrow-back' : 'arrow-disabled'}
              >
                <i className='arrows material-icons'>arrow_back</i>
              </WButton>
            </WNavItem>
            <WNavItem>
              <WButton
                onClick={goToNextSibling}
                className={nextSibling ? 'arrow-forward' : 'arrow-disabled'}
              >
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
              <WButton
                className={'undo-button disable-list-item-control'}
                onClick={tpsUndo}
              >
                <i className='material-icons '>undo</i>
              </WButton>
              <WButton className={'redo-button disable-list-item-control'}>
                <i className='material-icons' onClick={tpsRedo}>
                  redo
                </i>
              </WButton>
              <div className='region-landmarks-text'>Regional Landmarks:</div>
            </WLHeader>
            <div className='viewer-details'>
              <WRow>
                <WCol size='6'>
                  <div className='viewer-left'>
                    <div className='region-flag-container'>
                      <img
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = { errorImg }
                        }}
                        className='spreadsheet-flag'
                        src={thisFlag}
                      />
                    </div>
                    <div className='region-details-container'>
                      <div className='region-details'>
                        Region Name: {data.name}
                      </div>
                      <div
                        className='region-details'
                        style={{
                          cursor: 'pointer',
                          color: 'var(--baby-blue)',
                          display: 'inline-block',
                        }}
                      >
                        Parent Region:
                        <div
                          style={{
                            display: 'inline-block',
                          }}
                        >
                          {' '}
                          {editingParent ? (
                            <select
                              className='table-select'
                              style={{
                                color: 'var(--baby-blue)',
                                fontWeight: 'bold',
                              }}
                              onBlur={handleParentEdit}
                              autoFocus={true}
                              defaultValue={parent.name}
                            >
                              {parents.map((p, index) => (
                                <option key={index} value={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div
                              style={{
                                display: 'inline-block',
                              }}
                            >
                              <div
                                style={{
                                  cursor: 'pointer',
                                  color: 'var(--baby-blue)',
                                  display: 'inline-block',
                                }}
                                onClick={() => {
                                  navigateToAncestorRegion(
                                    parent,
                                    ids.length - 1
                                  )
                                }}
                              >
                                {parent ? parent.name : ''}{' '}
                              </div>
                            </div>
                          )}
                        </div>
                        {ids.length > 1 ? (
                          <WButton
                            onClick={() => toggleParentEdit(!editingParent)}
                            className='edit-parent-btn'
                          >
                            <i className='parent-button material-icons'>
                              mode_edit
                            </i>
                          </WButton>
                        ) : (
                          <div></div>
                        )}
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
                      <LandmarkContents
                        landmarks={landmarks}
                        editable={editable}
                        deleteLandmark={handleDeleteLandmark}
                        editRegionLandmark={editRegionLandmark}
                      ></LandmarkContents>
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
                          <WInput
                            className='landmark-input'
                            onBlur={handleLandmarkEdit}
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) handleLandmarkEdit(e)
                            }}
                            autoFocus={true}
                            defaultValue={landmark}
                            type='text'
                            inputClass='table-input-class'
                          />
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
