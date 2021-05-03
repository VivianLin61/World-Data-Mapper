const ObjectId = require('mongoose').Types.ObjectId
const Map = require('../models/map-model')
const Region = require('../models/region-model')
let queryRegions

module.exports = {
  Query: {
    /**
     @param   {object} req - the request object containing a user id
     @returns {array} an array of map objects on success, and an empty array on failure
   **/
    // getAllMaps: async (_, __, { req }) => {
    //   const _id = new ObjectId(req.userId)
    //   console.log(req)
    //   if (!_id) {
    //     return []
    //   }
    //   const maps = await Map.find({ owner: _id })
    //   if (maps) {
    //     return maps
    //   }
    // },
    getAllMaps: async (_, __, { req }, args) => {
      if (req.userId) {
        const _id = new ObjectId(req.userId)
        if (!_id) {
          return []
        }
        const maps = await Map.find({ owner: _id })
        if (maps) {
          return maps
        }
      } else {
        const { id } = args
        const _id = new ObjectId(id)
        if (!_id) {
          return []
        }
        const maps = await Map.find({ owner: _id })
        if (maps) {
          return maps
        }
      }
    },
    /**
     @param   {object} args - a map id
     @returns {object} a map on success and an empty object on failure
   **/
    getMapById: async (_, args) => {},
    /**
     @param   {object} args - a region id
     @returns {object} a region on success and an empty object on failure
   **/
    getAllRegions: async (_, args) => {
      const { ids } = args
      const mapId = new ObjectId(ids[0])
      const map = await Map.findOne({ _id: mapId })
      let mapSubregions = map.subregions

      if (ids.length == 1) {
        queryRegions = mapSubregions
      } else {
        getRegions(mapSubregions, ids[ids.length - 1])
      }
      if (queryRegions) {
        return queryRegions
      }
    },
  },
  //#region
  Mutation: {
    /**
     @param   {object} args - a region id and an empty region object
     @returns {string} the objectID of the region or an error message
   **/
    addSubRegion: async (_, args) => {
      const { region, ids, index } = args
      const mapId = new ObjectId(ids[0])
      const found = await Map.findOne({ _id: mapId })
      if (!found) return 'Map not found'
      let mapSubregions = found.subregions
      if (region._id == '') {
        region._id = new ObjectId()
      }
      if (ids.length == 1) {
        if (index < 0) mapSubregions.push(region)
        else mapSubregions.splice(index, 0, region)
      } else {
        // console.log('mapSubregions: ' + mapSubregions)

        addToSubRegion(mapSubregions, region.parentId, region)
      }
      const updated = await Map.updateOne(
        { _id: mapId },
        { subregions: mapSubregions }
      )
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
        subregions: [],
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
      return true
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

function addToSubRegion(arr, value, region) {
  arr.forEach((i) => {
    if (i._id == value) {
      let temp = i.subregions
      temp.push(region)
      i.subregions = temp
    } else {
      addToSubRegion(i.subregions, value, region)
    }
  })
}

//#endregion

function getRegions(arr, value, regionVariable) {
  let regions
  arr.forEach((i) => {
    if (i._id == value) {
      queryRegions = i.subregions
    } else {
      getRegions(i.subregions, value, regionVariable)
    }
  })
  return regions
}
