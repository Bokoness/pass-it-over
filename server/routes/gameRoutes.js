import express from 'express'
import Controller from '../controllers/GameController.js'

const router = express.Router()

const c = new Controller()
// Basic Crud routes
router.get('/', c.index())
// router.get('/user', auth(0), c.indexUser())
// router.get('/:id', auth(0), c.show())
router.post('/', c.store())
router.put('/:id', c.update())
router.delete('/:id',  c.destroy())

export default router
