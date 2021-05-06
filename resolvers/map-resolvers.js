const ObjectId = require('mongoose').Types.ObjectId
const Map = require('../models/map-model')
const Region = require('../models/region-model')
let queryRegions
let queryRegion
module.exports = {
  Query: {
    /**
     @param   {object} req - the request object containing a user id
     @returns {array} an array of map objects on success, and an empty array on failure
   **/
    getAllMaps: async (_, __, { req }, args) => {
      let _id
      if (req.userId) {
        _id = new ObjectId(req.userId)
      } else {
        const { id } = args
        _id = new ObjectId(id)
      }
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
    getRegion: async (_, args) => {
      const { ids } = args
      const mapId = new ObjectId(ids[0])
      const map = await Map.findOne({ _id: mapId })
      let mapSubregions = map.subregions
      if (ids.length == 1) {
        queryRegion = map
      } else {
        getDbRegion(mapSubregions, ids[ids.length - 1])
      }
      if (queryRegion) {
        return queryRegion
      }
    },
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

    getAncestors: async (_, args) => {
      const { ids } = args
      let queryAncestors = []
      const mapId = new ObjectId(ids[0])
      const map = await Map.findOne({ _id: mapId })
      let mapSubregions = map.subregions

      if (ids.length > 1) {
        if (ids.length == 2) {
          queryAncestors.push(map)
        } else {
          queryAncestors.push(map) //ROOT
          for (let i = 1; i < ids.length - 1; i++) {
            if (mapSubregions) {
              let temp = mapSubregions.filter(
                (region) => region._id.toString() == ids[i]
              )
              queryAncestors.push(temp[0])
              mapSubregions = temp[0].subregions
            }
          }
        }
      }

      if (queryAncestors) {
        return queryAncestors
      }
    },
  },

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
        addToSubRegion(mapSubregions, region.parentId, region, index)
      }
      const updated = await Map.updateOne(
        { _id: mapId },
        { subregions: mapSubregions }
      )
      return region._id
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
    deleteSubregion: async (_, args) => {
      const { regionId, ids, index } = args

      const mapId = new ObjectId(ids[0])
      const found = await Map.findOne({ _id: mapId })
      if (!found) return 'Map not found'
      let mapSubregions = found.subregions

      if (ids.length == 1) {
        mapSubregions = mapSubregions.filter(
          (region) => region._id.toString() !== regionId
        )
      } else {
        deleteFromRegion(mapSubregions, ids[ids.length - 1], regionId)
      }

      const updated = await Map.updateOne(
        { _id: mapId },
        { subregions: mapSubregions }
      )
      return true
    },
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
    updateRegionField: async (_, args) => {
      const { ids, regionId, field } = args
      let { value } = args
      const mapId = new ObjectId(ids[0])
      const found = await Map.findOne({ _id: mapId })
      if (!found) return 'Map not found'
      let mapSubregions = found.subregions

      if (ids.length == 1) {
        mapSubregions.map((region) => {
          if (region._id.toString() == regionId) {
            region[field] = value
          }
        })
      } else {
        updateRegion(mapSubregions, ids[ids.length - 1], regionId, value, field)
      }
      const updated = await Map.updateOne(
        { _id: mapId },
        { subregions: mapSubregions }
      )

      return false
    },
    /**
     @param   {object} args - a map objectID and field to sort by
     @returns {array} the sorted item array on success, or initial ordering on failure
   **/
    sortRegions: async (_, args) => {
      const { ids, criteria } = args
      const mapId = new ObjectId(ids[0])
      const found = await Map.findOne({ _id: mapId })

      let mapSubregions = found.subregions

      if (ids.length == 1) {
        let oldRegionsIds = []
        let regionsToSort = []
        for (let i = 0; i < mapSubregions.length; i++) {
          let region = mapSubregions[i]
          oldRegionsIds.push(region._id)
          regionsToSort.push(region)
        }
        let sortIncreasing = true
        // IS IT ALREADY SORTED ACCORDING TO THE SELECTED
        // CRITERIA IN INCREASING ORDER?
        if (isInIncreasingOrder(regionsToSort, criteria)) {
          sortIncreasing = false
        }
        let compareFunction = makeCompareFunction(criteria, sortIncreasing)
        regionsToSort = regionsToSort.sort(compareFunction)
        // NOW GET THE SORTED ORDER FOR IDS
        let newRegions = []
        for (let i = 0; i < regionsToSort.length; i++) {
          let region = regionsToSort[i]
          newRegions.push(region)
        }
        mapSubregions = newRegions
      } else {
        sortSubRegions(mapSubregions, ids[ids.length - 1], criteria)
      }

      const updated = await Map.updateOne(
        { _id: mapId },
        { subregions: mapSubregions }
      )

      return true
    },
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

function addToSubRegion(arr, value, region, index) {
  arr.forEach((i) => {
    if (i._id == value) {
      let temp = i.subregions
      if (index < 0) {
        temp.push(region)
      } else {
        temp.splice(index, 0, region)
      }
      i.subregions = temp
    } else {
      addToSubRegion(i.subregions, value, region, index)
    }
  })
}

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

function deleteFromRegion(arr, value, regionId) {
  arr.forEach((i) => {
    if (i._id == value) {
      let temp = i.subregions
      temp = temp.filter((region) => region._id.toString() !== regionId)
      i.subregions = temp
    } else {
      deleteFromRegion(i.subregions, value, regionId)
    }
  })
}

function updateRegion(arr, value, regionId, update, field) {
  arr.forEach((i) => {
    if (i._id == value) {
      let temp = i.subregions
      temp.map((region) => {
        if (region._id.toString() == regionId) {
          region[field] = update
        }
      })
      i.subregions = temp
    } else {
      updateRegion(i.subregions, value, regionId, update, field)
    }
  })
}

function sortSubRegions(arr, value, criteria) {
  arr.forEach((i) => {
    if (i._id == value) {
      let temp = i.subregions
      //temp is the region we are going to sort
      let oldRegionsIds = []
      let regionsToSort = []
      for (let i = 0; i < temp.length; i++) {
        let region = temp[i]
        oldRegionsIds.push(region._id)
        regionsToSort.push(region)
      }
      let sortIncreasing = true
      // IS IT ALREADY SORTED ACCORDING TO THE SELECTED
      // CRITERIA IN INCREASING ORDER?
      if (isInIncreasingOrder(regionsToSort, criteria)) {
        sortIncreasing = false
      }
      let compareFunction = makeCompareFunction(criteria, sortIncreasing)
      regionsToSort = regionsToSort.sort(compareFunction)
      // NOW GET THE SORTED ORDER FOR IDS
      let newRegions = []
      for (let i = 0; i < regionsToSort.length; i++) {
        let region = regionsToSort[i]
        newRegions.push(region)
      }
      temp = newRegions
      i.subregions = temp
    } else {
      sortSubRegions(i.subregions, value, criteria)
    }
  })
}
function isInIncreasingOrder(regionToTest, sortingCriteria) {
  for (let i = 0; i < regionToTest.length - 1; i++) {
    if (regionToTest[i][sortingCriteria] > regionToTest[i + 1][sortingCriteria])
      return false
  }
  return true
}

makeCompareFunction = (criteria, increasing) => {
  return function (item1, item2) {
    let negate = -1
    if (increasing) {
      negate = 1
    }
    let value1 = item1[criteria]
    let value2 = item2[criteria]
    if (value1 < value2) {
      return -1 * negate
    } else if (value1 === value2) {
      return 0
    } else {
      return 1 * negate
    }
  }
}

function getDbRegion(arr, value) {
  arr.forEach((i) => {
    if (i._id == value) {
      queryRegion = i
    } else {
      getDbRegion(i.subregions, value)
    }
  })
}
