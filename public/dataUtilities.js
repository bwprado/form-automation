// Filename: public/dataUtilities.js

/**
 * @fileoverview Utiltiies for Data Functions
 */
import wixData from 'wix-data'
import { fetch } from 'wix-fetch'

// Code written in public files is shared by your site's
// Backend, page code, and site code environments.

/**
 * This function retrieves all data from a collection using the hasNext and next capabilities
 * @author {Chris Derrell}
 * @param {string} dataCollection - the name of the collection to retrieve data from
 * @returns {Promise<any[]>}
 */
export async function getAllData(dataCollection) {
  try {
    let results = await wixData
      .query(dataCollection)
      .limit(1000)
      .include('serviceOpportunities')
      .find()
    let items = results.items
    while (results.hasNext()) {
      results = await results.next()
      items = items.concat(results.items)
    }
    return items
  } catch (error) {
    console.log(error)
    return []
  }
}

/**
 * @function getMultiReferencePropertyFromCollection
 * @param {string} multiRefColumn
 * @param {string} collection
 * @param {string} collectionId
 * @returns {Promise<any[]>}
 */
export async function getMultiReferencePropertyFromCollection(
  multiRefColumn,
  collection,
  collectionId
) {
  if (!multiRefColumn) {
    throw new Error('Missing multiRefColumn')
  }
  if (!collection) {
    throw new Error('Missing collection')
  }
  if (!collectionId) {
    throw new Error('Missing collectionId')
  }

  let response = await wixData.queryReferenced(
    collection,
    collectionId,
    multiRefColumn
  )
  return response.items
}

export async function getFileSizeInBytes(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })

    const clen = response?.headers?._headers['content-length'][0]
    console.log(clen)
    console.log(response)
    return clen
  } catch (err) {
    throw Error('failed pulling filesize for ' + url)
  }
}
