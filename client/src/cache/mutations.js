import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      _id
      name
      password
    }
  }
`

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      email
      password
      name
    }
  }
`
export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $_id: String!
    $email: String!
    $password: String!
    $name: String!
  ) {
    updateUser(_id: $_id, email: $email, password: $password, name: $name) {
      _id
      email
      password
      name
    }
  }
`

export const ADD_MAP = gql`
  mutation AddMap($name: String!, $owner: String!) {
    addMap(name: $name, owner: $owner)
  }
`

export const RENAME_MAP = gql`
  mutation RenameMap($name: String!, $_id: String!) {
    renameMap(name: $name, _id: $_id)
  }
`

export const DELETE_MAP = gql`
  mutation DeleteMap($_id: String!) {
    deleteMap(_id: $_id)
  }
`
// export const ADD_SUBREGION = gql`
//   mutation AddSubRegion($region: RegionInput, $ids: [String!], $index: Int) {
//     addSubRegion(region: $region, ids: $ids, index: $index)
//   }
// `

export const ADD_SUBREGION = gql`
  mutation AddSubRegion($region: RegionInput, $ids: [String!], $index: Int!) {
    addSubRegion(region: $region, ids: $ids, index: $index)
  }
`
