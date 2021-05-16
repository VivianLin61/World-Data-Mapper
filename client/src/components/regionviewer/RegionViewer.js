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
import LandmarkContents from '../regionviewer/LandmarkContents'
import { UpdateLandmark_Transaction } from '../../utils/jsTPS'

const RegionViewer = (props) => {
  let history = useHistory()
  let data = props.location.state.data
  let parent
  let ancestors = props.location.state.ancestors
  let url = props.location.state.url
  let ids = props.location.state.ids
  let prevSibling
  let nextSibling
  let landmarks
  let editable
  const [landmark, setLandmark] = useState('')

  //#region Get Landmarks
  const {
    loading,
    error,
    data: dataLandmarks,
    refetch,
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
    landmarks = landmarks.sort()
    editable = landmarkData.editable
  }

  const mutationOptions = {
    refetchQueries: [
      { query: GET_LANDMARKS, variables: { ids: ids, regionId: data._id } },
    ],
    awaitRefetchQueries: true,
  }

  const [AddLandmark] = useMutation(ADD_LANDMARK, mutationOptions)
  const [DeleteLandmark] = useMutation(DELETE_LANDMARK, mutationOptions)
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
    const retVal = await props.tps.undoTransaction()
    return retVal
  }
  const tpsRedo = async () => {
    const retVal = await props.tps.doTransaction()
    return retVal
  }
  //#endregion

  //#region GET PARENT
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
  }

  const handleLandmarkEdit = (e) => {
    setLandmark('')
  }
  const navigateBackToRegionSpreadshhet = (e) => {
    history.push(`${props.location.state.url}/${parent._id}`, { data: parent })
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
    history.push(path, { data: region })
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
      path.push(nextSibling._id)
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
              <WButton className={'undo-button'} onClick={tpsUndo}>
                <i className='material-icons'>undo</i>
              </WButton>
              <WButton className={'redo-button'}>
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
                        Parent Region: {parent ? parent.name : ''}
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
