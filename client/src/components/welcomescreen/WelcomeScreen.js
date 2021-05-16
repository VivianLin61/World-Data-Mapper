import Login from '../modals/Login'
import MainLogo from '../welcomescreen/MainLogo'
import CreateAccount from '../modals/CreateAccount'
import NavbarOptions from '../navbar/NavbarOptions'
import React, { useState } from 'react'
import { WNavbar, WNavItem } from 'wt-frontend'
import { WLayout, WLHeader, WLMain } from 'wt-frontend'

const WelcomeScreen = (props) => {
  const auth = props.user === null ? false : true
  const [showLogin, toggleShowLogin] = useState(false)
  const [showCreate, toggleShowCreate] = useState(false)

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
