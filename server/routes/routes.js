import express from 'express'
import exampleRoutes from './exampleRoutes.js'
import gameRoutes from './gameRoutes.js'
import authRoutes from './authRoutes.js'


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/game', gameRoutes)
router.use('/example', exampleRoutes)


export default router
