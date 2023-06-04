// Filename: public/dataUtilities.js

/**
 * @fileoverview Utiltiies for Data Functions
 */
import wixData from 'wix-data'
import { fetch } from 'wix-fetch'

// Code written in public files is shared by your site's
// Backend, page code, and site code environments.

// getAllData retrieves all data using the hasNext and Next capabilities
export async function getAllData(dataCollection) {
  let results = await wixData
    .query('Ministries')
    .include('serviceOpportunities')
    .find()
  let length = results.length
  let items = length ? results.items : []

  while (length > 0 && results.hasNext()) {
    results = await results.next()
    length = results.length
    if (length) {
      items = items.concat(results.items)
    }
  }
  return items
}

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
