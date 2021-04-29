import { gql } from '@apollo/client'

export const GET_DB_USER = gql`
  query GetDBUser {
    getCurrentUser {
      _id
      name
      email
    }
  }
`

export const GET_DB_MAPS = gql`
  query GetDBMaps {
    getAllMaps {
      _id
      name
      owner
      child {
        _id
        name
        subregions {
          _id
          name
          capital
          leader
          landmarks
        }
      }
    }
  }
`
