const imageCache = require('image-cache')
const fs = require('fs')
const axios = require('axios')
const { setupCache } = require('axios-cache-adapter')

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000,
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
  adapter: cache.adapter,
})

const myImage = async () => {
  console.log('try')
  const images = await imageCache.fetchImages(image)
  console.log(images)
}

// (async () => {
//   try {
//     var conn = await myImage();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// })();

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', (e) => reject(e))
      })
  )

const downloadImage = async (url, imagePath) => {
  const payload = {
    url,
    method: 'get',
    responseType: 'stream',
  }
  const response = await api.request(payload)

  const length = await cache.store.length()
  console.log(cache.store)

  new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(imagePath))
      .on('finish', () => resolve())
      .on('error', (e) => reject(e))
  })
}

const checkIfFileExist = (path) => {
  if (!fs.existsSync(path)) {
    return false
  }
  return false
}

;(async () => {
  try {
    const image =
      'https://images.unsplash.com/photo-1516049084740-9a14b9c4239c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1397&q=80'

    // downloadImage(image, "example-1.png");

    const check = await checkIfFileExist('example-1.png')
    console.log(check)
  } catch (error) {
    console.log(error)
  }
})()
