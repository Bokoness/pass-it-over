import axios from 'axios'
import csv from 'csvtojson'
import { promises as fs } from 'fs'

export default async function fetchTranslation() {
  const csvString = await axios.get(process.env.TRANSLATION_CSV_URL)

  csv({ output: 'csv' })
    .fromString(csvString.data)
    .then((csvRow) => {
      const heJson = csvRow.reduce((a, b, i) => {
        a[b[0]] = b[1]
        return a
      }, {})
      const enJson = csvRow.reduce((a, b, i) => {
        a[b[0]] = b[2]
        return a
      }, {})
      const arJson = csvRow.reduce((a, b, i) => {
        a[b[0]] = b[3]
        return a
      }, {})

      fs.writeFile('public/he.json', JSON.stringify(heJson))
      fs.writeFile('public/en.json', JSON.stringify(enJson))
      fs.writeFile('public/ar.json', JSON.stringify(arJson))
    })
}

