import React, { useState } from 'react'
import { UPDATE_USER } from '../../cache/mutations'
import { useMutation } from '@apollo/client'
import NavbarOptions from '../navbar/NavbarOptions'
import Logo from '../navbar/Logo'
import { useHistory } from 'react-router-dom'
import {
  WModal,
  WMHeader,
  WMMain,
  WMFooter,
  WButton,
  WInput,
  WLayout,
  WLHeader,
  WNavbar,
  WNavItem,
} from 'wt-frontend'

const UpdateScreen = (props) => {
  const [UpdateUser] = useMutation(UPDATE_USER)
  const [input, setInput] = useState({
    email: '',
    password: '',
    name: '',
  })
  let history = useHistory()
  const updateInput = (e) => {
    const { name, value } = e.target
    const updated = { ...input, [name]: value }
    setInput(updated)
  }

  const handleUpdateAccount = async (e) => {
    const { data } = await UpdateUser({
      variables: {
        _id: props.user._id,
        email: input.email,
        password: input.password,
        name: input.name,
      },
    })
    
    // return data
  }

  // if (!(props.user && props.match.params.id == props.user._id)) {
  //   history.push(`/`)
  // }
  if ((props.user == null)) {
    history.push(`/`)
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
              hoverAnimation='text-primary'>
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
      <WModal className='signup-modal' cover='true' visible={true}>
        <WMHeader
          className='modal-header'
          onClose={() => history.push('/home')}
        >
          Update Account
        </WMHeader>
        <WMMain>
          <WInput
            className='modal-input'
            onBlur={updateInput}
            name='name'
            labelAnimation='up'
            barAnimation='solid'
            labelText='Name'
            wType='outlined'
            inputType='text'
          />

          <div className='modal-spacer'>&nbsp;</div>
          <WInput
            className='modal-input'
            onBlur={updateInput}
            name='email'
            labelAnimation='up'
            barAnimation='solid'
            labelText='Email Address'
            wType='outlined'
            inputType='text'
          />
          <div className='modal-spacer'>&nbsp;</div>
          <WInput
            className='modal-input'
            onBlur={updateInput}
            name='password'
            labelAnimation='up'
            barAnimation='solid'
            labelText='Password'
            wType='outlined'
            inputType='password'
          />
          <div className='modal-spacer'>&nbsp;</div>
        </WMMain>
        <WMFooter>
          <WButton
            className='modal-button'
            onClick={handleUpdateAccount}
            span
            clickAnimation='ripple-light'
            hoverAnimation='darken'
            shape='rounded'
            color='primary'
          >
            Submit
          </WButton>
        </WMFooter>
      </WModal>
    </WLayout>
  )

  //check if the is is equal to the logged in user id
}

export default UpdateScreen
