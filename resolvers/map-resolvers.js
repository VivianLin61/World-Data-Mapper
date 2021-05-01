const ObjectId = require('mongoose').Types.ObjectId
const Map = require('../models/map-model')
const Region = require('../models/region-model')

module.exports = {
  Query: {
    /**
     @param   {object} req - the request object containing a user id
     @returns {array} an array of map objects on success, and an empty array on failure
   **/
    getAllMaps: async (_, __, { req }) => {
      const _id = new ObjectId(req.userId)
      if (!_id) {
        return []
      }
      const maps = await Map.find({ owner: _id })
      if (maps) {
        return maps
      }
    },
    /**
     @param   {object} args - a map id
     @returns {object} a map on success and an empty object on failure
   **/
    getMapById: async (_, args) => {},
  },
  Mutation: {
    /**
     @param   {object} args - a region id and an empty region object
     @returns {string} the objectID of the region or an error message
   **/
    addSubRegion: async (_, args) => {
      console.log(args)
      // const { region, _id } = args
      // const mapId = new ObjectId(_id)
      // const found = await Map.findOne({ _id: mapId })
      // if (!found) return 'Map not found'
      // let mapSubregions = found.subregions
      // if (_id == region.parent) {
      //   if (index < 0) mapSubregions.push(region)
      //   else mapSubregions.splice(index, 0, region)
      // } else {
      // }
      // const updated = await Map.updateOne(
      //   { _id: mapId },
      //   { subregions: mapSubregions }
      // )
      return JSON.stringify(args)
    },
    /**
     @param   {object} args - an empty map object
     @returns {string} the objectID of the map or an error message
   **/
    addMap: async (_, args) => {
      const { name, owner } = args
      const _id = new ObjectId()
      const map = new Map({
        _id: _id,
        name: name,
        owner: owner,
        subregions: [null],
      })
      const saved = await map.save()

      return true
    },
    /**
     @param   {object} args - a map objectID and region objectID
     @returns {array} the updated item array on success or the initial
              array on failure
   **/
    deleteSubregion: async (_, args) => {},
    /**
     @param   {object} args - a map objectID
     @returns {boolean} true on successful delete, false on failure
   **/
    deleteMap: async (_, args) => {
      const { _id } = args
      const objectId = new ObjectId(_id)
      const deleted = await Map.deleteOne({ _id: objectId })
      if (deleted) return true
      else return false
    },

    /**
     @param   {object} args - a map objectID, field, and the update value
     @returns {boolean} true on successful update, false on failure
   **/
    renameMap: async (_, args) => {
      const { name, _id } = args

      const objectId = new ObjectId(_id)
      const updated = await Map.updateOne(
        { _id: objectId },
        { $set: { name: name } }
      )

      const map = await Map.findOne({ _id: objectId })
      return map.name
    },
    /**
     @param   {object} args - a map objectID, an region objectID, field, and update value.
     @returns {array} the updated item array on success, or the initial item array on failure
   **/
    updateRegionField: async (_, args) => {},
    /**
     @param   {object} args - a map objectID and field to sort by
     @returns {array} the sorted item array on success, or initial ordering on failure
   **/
    sortRegions: async (_, args) => {},
    /**
     @param   {object} args - a region objectID and landmark name
     @returns {array} the sorted region array on success, or initial ordering on failure
   **/
    addLandmark: async (_, args) => {},
    /**
     @param   {object} args - a region objectID and landmark name to remove
     @returns {array} the updated landmark array on success, or initial ordering on failure
   **/
    deleteLandmark: async (_, args) => {},
    /**
     @param   {object} args - a region objectID, landmark name to update, and new landmark
     @returns {array} the updated landmark array on success, or initial ordering on failure
   **/
    updateLandmark: async (_, args) => {},
  },
}
