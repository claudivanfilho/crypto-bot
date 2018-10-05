import express from 'express'
import userController from '../controllers/user'

const router = express.Router()

// ======= USER ==============================================
router.get('/user', (req, res) => (userController.get(req, res)))
// router.post('/user', (req, res) => (userController.create(req, res)))
router.put('/user', (req, res, next) => (userController.update(req, res, next)))

export default router
