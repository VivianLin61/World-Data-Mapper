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
  query GetDBMaps($userId: String) {
    getAllMaps(userId: $userId) {
      _id
      name
      owner
    }
  }
`

export const GET_ANCESTORS = gql`
  query GetAncestors($ids: [String!]) {
    getAncestors(ids: $ids) {
      _id
      name
      subregions {
        _id
        name
      }
    }
  }
`

export const GET_DB_REGIONS = gql`
  query GetDBRegions($ids: [String]) {
    getAllRegions(ids: $ids) {
      _id
      name
      capital
      leader
      landmarks
      parentId
      mapId
      subregions {
        _id
        name
        capital
        leader
        landmarks
        parentId
        mapId
      }
    }
  }
`

export const GET_REGION = gql`
  query GetRegion($ids: [String!]) {
    getRegion(ids: $ids) {
      _id
      name
      subregions {
        _id
        name
        capital
        leader
        landmarks
        parentId
        mapId
      }
    }
  }
`
