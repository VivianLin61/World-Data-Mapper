const { gql } = require('apollo-server')

const typeDefs = gql`
  type Map {
    _id: String!
    name: String!
    owner: String!
    child: Region
    subregions: [Region]
  }

  type Region {
    _id: String!
    name: String!
    capital: String!
    leader: String!
    parent: Region!
    child: Region
    # flag: [img]
    landmarks: [String!]
    subregions: [Region]
  }

  extend type Query {
    getAllMaps: [Map]
    getMapById(_id: String!): Region
  }

  extend type Mutation {
    addMap(name: String, owner: String): Boolean
    renameMap(_id: String, name: String!): 
    deleteMap(_id: String!): Boolean
    deleteSubregion(regionId: String!, _id: String!): [Region]
    addSubregion(region: RegionInput!, _id: String!, index: Int!): String
    sortRegions(_id: String!, field: String!): Boolean
    updateRegionField(_id: String!, field: String!, value: String!): [Region]
    addLandmark(_id: String!, landmark: String!): String
    deleteLandmark(_id: String!, landmark: String!): String
    updateLandmark(_id: String!, landmark: String!, name: String!): String!
  }

  input MapInput {
    _id: String
    name: String
    owner: String
    child: RegionInput
    subregions: [RegionInput]
  }

  input RegionInput {
    _id: String
    name: String
    capital: String
    leader: String
    parent: RegionInput
    child: RegionInput
    # flag: [img]
    landmarks: [String]
    subregions: [RegionInput]
  }
`

module.exports = { typeDefs: typeDefs }
