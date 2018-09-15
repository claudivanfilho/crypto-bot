import express from 'express'
import robotController from '../controllers/robot'
import userController from '../controllers/user'
import traderInfoController from '../controllers/traderInfo'
import transactionController from '../controllers/transaction'

const router = express.Router()

// ======= USER ==============================================
router.get('/user', (req, res) => (userController.get(req, res)))
// router.post('/user', (req, res) => (userController.create(req, res)))
router.put('/user', (req, res, next) => (userController.update(req, res, next)))
// ======= ROBOT =============================================
router.get('/robots', (req, res) => (robotController.getAll(res)))
router.put('/robot/:pair', (req, res) => (robotController.saveOrUpdate(req, res)))
// ======= TRADER INFO =======================================
router.get('/tradeHistory', (req, res, next) => (traderInfoController.tradeHistory(req, res, next)))
router.get('/coinsAvailable', (req, res, next) => (traderInfoController.coinsAvailable(req, res, next)))
router.get('/openOrders', (req, res, next) => (traderInfoController.openOrders(req, res, next)))
// ======= TRANSACTIONS ======================================
router.post('/buy', (req, res, next) => (transactionController.buy(req, res, next)))
router.post('/buyImmediate', (req, res, next) => (transactionController.buyImmediate(req, res, next)))
router.post('/move', (req, res, next) => (transactionController.move(req, res, next)))
router.post('/moveImmediate', (req, res, next) => (transactionController.moveImmediate(req, res, next)))
router.post('/sell', (req, res, next) => (transactionController.sell(req, res, next)))
router.post('/sellImmediate', (req, res, next) => (transactionController.sellImmediate(req, res, next)))
router.post('/cancel', (req, res, next) => (transactionController.cancel(req, res, next)))

export default router
