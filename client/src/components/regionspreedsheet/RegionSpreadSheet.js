import React from 'react'
import { useMutation } from '@apollo/client'
import NavbarOptions from '../navbar/NavbarOptions'
import MainContents from '../regionspreedsheet/MainContents'
import { WButton, WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WCard } from 'wt-frontend'
import { ADD_SUBREGION } from '../../cache/mutations.js'
import { useHistory } from 'react-router-dom'

const RegionSpreadSheet = (props) => {
  let history = useHistory()
  let regions = []
  const [AddSubRegion] = useMutation(ADD_SUBREGION)

  const addSubRegion = async () => {
    const region = {
      _id: '',
      name: 'No Name',
      capital: 'No Capital',
      leader: 'No Leader',
      parent: null,
      child: null,
      landmarks: [''],
      subregions: [null],
    }

    const { data } = await AddSubRegion({
      variables: {
        region: region,
      },
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
          <WCard className='regions-container' wLayout='header-content'>
            <WLHeader className='region-header'>
              <WButton
                className={'add-button'}
                // onClick={props.activeid ? disabledClick : props.createNewList}
                // {...buttonOptions}
              >
                <i className='material-icons'>add</i>
              </WButton>
              <WButton className={'undo-button'}>
                <i className='material-icons'>undo</i>
              </WButton>
              <WButton className={'redo-button'}>
                <i className='material-icons'>redo</i>
              </WButton>
              <div>Region Name: United States </div>
            </WLHeader>
            <div className='regions'>
              <MainContents
                addSubregion={addSubRegion}
                regions={regions}
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
  )
}

export default RegionSpreadSheet
