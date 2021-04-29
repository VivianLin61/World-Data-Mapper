import Login from '../modals/Login'
import MainLogo from '../welcomescreen/MainLogo'
import CreateAccount from '../modals/CreateAccount'
import NavbarOptions from '../navbar/NavbarOptions'
import * as mutations from '../../cache/mutations'
// import { GET_DB_MAPS } from '../../cache/queries'
import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { WNavbar, WNavItem, WCard } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend'

const WelcomeScreen = (props) => {
  const keyCombination = (e, callback) => {
    if (e.key === 'z' && e.ctrlKey) {
      if (props.tps.hasTransactionToUndo()) {
        tpsUndo()
      }
    } else if (e.key === 'y' && e.ctrlKey) {
      if (props.tps.hasTransactionToRedo()) {
        tpsRedo()
      }
    }
  }
  document.onkeydown = keyCombination

  const auth = props.user === null ? false : true
  let todolists = []
  let SidebarData = []
  const [sortRule, setSortRule] = useState('unsorted') // 1 is ascending, -1 desc
  const [activeList, setActiveList] = useState({})
  const [showLogin, toggleShowLogin] = useState(false)
  const [showCreate, toggleShowCreate] = useState(false)
  const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo())
  const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo())

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

  const setShowLogin = () => {
    toggleShowCreate(false)
    toggleShowLogin(!showLogin)
  }

  const setShowCreate = () => {
    toggleShowLogin(false)
    toggleShowCreate(!showCreate)
  }

  return (
    <WLayout wLayout='header'>
      <WLHeader>
        <WNavbar color='colored'>
          <ul>
            <WNavItem>
              <div className='logo'>World Data Mapper</div>
            </WNavItem>
          </ul>
          <ul>
            <NavbarOptions
              fetchUser={props.fetchUser}
              auth={auth}
              user={props.user}
              setShowCreate={setShowCreate}
              setShowLogin={setShowLogin}
            />
          </ul>
        </WNavbar>
      </WLHeader>

      <WLMain>{!showCreate && !showLogin && <MainLogo></MainLogo>}</WLMain>

      {showCreate && (
        <CreateAccount
          fetchUser={props.fetchUser}
          setShowCreate={setShowCreate}
        />
      )}

      {showLogin && (
        <Login fetchUser={props.fetchUser} setShowLogin={setShowLogin} />
      )}
    </WLayout>
  )
}

export default WelcomeScreen
