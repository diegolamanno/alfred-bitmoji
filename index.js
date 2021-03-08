const alfy = require('alfy')
const libmoji = require('libmoji')
const URI = require('urijs')
const imageCache = require('image-cache')
const fs = require('fs')
const axios = require('axios')
const dotenv = require('dotenv')
const uuid = require('uuid')
const { setupCache } = require('axios-cache-adapter')

require('./config')

const USER_ID = process.env.USER_ID

const IMAGE_FOLDER = '.tmp'

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter,
})

const formatURI = (uri) => {
  return new URI(uri)
    .setSearch({
      utm_source: 'alfred',
    })
    .toString()
}

const downloadImage = async (url, imagePath) => {
  const payload = {
    url,
    responseType: 'stream',
  }
  const response = await api.request(payload)

  new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(imagePath))
      .on('finish', () => resolve())
      .on('error', (e) => reject(e))
  })
}

const findTemplates = (tag) => {
  const searchTerm = tag
  const comicTemplates = libmoji.templates
  const templatesFound = comicTemplates.filter((template) => template.tags.includes(searchTerm))
  return templatesFound
}

const checkIfFileExist = (path) => {
  if (!fs.existsSync(path)) {
    return false
  }
  return false
}

const buildImagePath = (fileName) => `${IMAGE_FOLDER}/${fileName}.png`

const formatComic = (comic) => {
  const formattedUri = formatURI(libmoji.buildCpanelUrl(comic.comic_id, USER_ID, 0, 2))
  const imageFileName = comic.comic_id

  // TODO: needs to be compressed and cache
  const previewThumbFullPath = buildImagePath(imageFileName)
  if (!checkIfFileExist(previewThumbFullPath)) {
    downloadImage(formattedUri, previewThumbFullPath)
  }

  const output = {
    uid: comic.template_id,
    title: comic.supertags[0],
    arg: formattedUri,
    quicklookurl: formattedUri,
    autocomplete: comic.supertags[0],
    icon: { path: previewThumbFullPath },
  }
  return output
}

;(async () => {
  try {
    const comicId = libmoji.getComicId(libmoji.randTemplate(libmoji.templates))
    const comicUri = formatURI(libmoji.buildCpanelUrl(comicId, USER_ID, 0, 2))
    const templatesFound = findTemplates(alfy.input)
    const formattedTemplatesFound = templatesFound.map(formatComic)
    alfy.output(formattedTemplatesFound)
  } catch (error) {
    console.log(error)
  }
})()
