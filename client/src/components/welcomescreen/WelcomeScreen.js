import Logo from '../navbar/Logo'
import Login from '../modals/Login'
import MainLogo from '../welcomescreen/MainLogo'
import CreateAccount from '../modals/CreateAccount'
import NavbarOptions from '../navbar/NavbarOptions'
import * as mutations from '../../cache/mutations'
import SidebarContents from '../sidebar/SidebarContents'
import { GET_DB_TODOS } from '../../cache/queries'
import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { WNavbar, WNavItem, WCard } from 'wt-frontend'
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend'
import {
  UpdateListField_Transaction,
  SortItems_Transaction,
  UpdateListItems_Transaction,
  ReorderItems_Transaction,
  EditItem_Transaction,
} from '../../utils/jsTPS'

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

  const { loading, error, data, refetch } = useQuery(GET_DB_TODOS)

  if (loading) {
    console.log(loading, 'loading')
  }
  if (error) {
    console.log(error, 'error')
  }
  if (data) {
    // Assign todolists
    for (let todo of data.getAllTodos) {
      todolists.push(todo)
    }
    // if a list is selected, shift it to front of todolists
    if (activeList._id) {
      let selectedListIndex = todolists.findIndex(
        (entry) => entry._id === activeList._id
      )
      let removed = todolists.splice(selectedListIndex, 1)
      todolists.unshift(removed[0])
    }
    // create data for sidebar links
    for (let todo of todolists) {
      if (todo) {
        SidebarData.push({ _id: todo._id, name: todo.name })
      }
    }
  }

  // NOTE: might not need to be async
  const reloadList = async () => {
    if (activeList._id) {
      let tempID = activeList._id
      let list = todolists.find((list) => list._id === tempID)
      setActiveList(list)
    }
  }

  const loadTodoList = (list) => {
    props.tps.clearAllTransactions()
    setCanUndo(props.tps.hasTransactionToUndo())
    setCanRedo(props.tps.hasTransactionToRedo())
    setActiveList(list)
  }

  const mutationOptions = {
    refetchQueries: [{ query: GET_DB_TODOS }],
    awaitRefetchQueries: true,
    onCompleted: () => reloadList(),
  }

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
              <Logo className='logo' />
            </WNavItem>
          </ul>
          <ul>
            <NavbarOptions
              fetchUser={props.fetchUser}
              auth={auth}
              setShowCreate={setShowCreate}
              setShowLogin={setShowLogin}
              reloadTodos={refetch}
              setActiveList={loadTodoList}
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
        <Login
          fetchUser={props.fetchUser}
          reloadTodos={refetch}
          setShowLogin={setShowLogin}
        />
      )}
    </WLayout>
  )
}

export default WelcomeScreen
