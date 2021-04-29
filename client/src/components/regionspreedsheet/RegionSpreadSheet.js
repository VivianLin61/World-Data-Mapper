import React from 'react'
import { useMutation } from '@apollo/client'
import NavbarOptions from '../navbar/NavbarOptions'
import MainContents from '../regionspreedsheet/MainContents'
import { WButton, WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain } from 'wt-frontend'
import { ADD_SUBREGION } from '../../cache/mutations.js'

const RegionSpreadSheet = (props) => {
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
        {/* <MainContents
          addSubregion={addSubRegion}
          //   deleteItem={deleteItem}
          //   editItem={editItem}
          //   reorderItem={reorderItem}
          //   setShowDelete={setShowDelete}
          //   undo={tpsUndo}
          //   redo={tpsRedo}
          //   canUndo={canUndo}
          //   canRedo={canRedo}
          //   sort={sort}
        /> */}
      </WLMain>
    </WLayout>
  )
}

export default RegionSpreadSheet
