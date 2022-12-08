import express from 'express'
import cookieParser from 'cookie-parser'
import chalk from 'chalk'
import routes from './routes/routes.js'
import BaseController from './controllers/BaseController.js'
import logger from './services/Logger.js'
const app = express()



app.use(cookieParser())
app.use(logger())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))
app.use(express.static('public'))

app.use('/api', routes)

app.get('*', BaseController.serveHtml())

const startServer = async () => {
  try {
    const port = process.env.PORT
    console.log(chalk.bgGreen('connected to DB'))
    app.listen(port, () => {
      console.log(
        chalk.bgBlue(
          `Server is listening on port http://localhost:${chalk.bold(port)}`,
        ),
      )
    })
  } catch (e) {
    console.log(chalk.bgRed('DB connection error', e))
  }
}

startServer().then(() => console.log('Server is running'))
