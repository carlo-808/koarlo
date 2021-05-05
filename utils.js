'use strict'
const http = require('http')

const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const resBody = []

    const req = http.request(options, (response) => {
      response.on('data', (data) => {
        resBody.push(data)
      })

      response.on('end', () => {
        let result
        try {
          result = Buffer.concat(resBody).toString()
        } catch (err) {
          reject(err)
        }

        resolve(result)
      })
    })

    req.end()
  })
}

module.exports = {
  makeRequest
}
