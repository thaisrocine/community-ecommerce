import express, { Request, Response } from 'express'
import { UserController } from './controllers/UserController'
import { StoreController } from './controllers/StoreController'
import { ProductController } from './controllers/ProductController'
import { OrderController } from './controllers/OrderController'

const router = express.Router()

const userCtrl = new UserController()
const storeCtrl = new StoreController()
const productCtrl = new ProductController()
const orderCtrl = new OrderController()

// Users
router.post('/users', async (req: Request, res: Response) => {
  try {
    const user = await userCtrl.create(req.body)
    res.status(201).json(user)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await userCtrl.getById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const updated = await userCtrl.update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'User not found' })
    res.json(updated)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const ok = await userCtrl.delete(req.params.id)
    if (!ok) return res.status(404).json({ error: 'User not found' })
    res.status(204).send()
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.post('/users/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await userCtrl.login(email, password)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    res.json(user)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

// Stores
router.post('/stores', async (req: Request, res: Response) => {
  try {
    const store = await storeCtrl.create(req.body)
    res.status(201).json(store)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/stores/:id', async (req: Request, res: Response) => {
  try {
    const store = await storeCtrl.getById(req.params.id)
    if (!store) return res.status(404).json({ error: 'Store not found' })
    res.json(store)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/stores/owner/:ownerId', async (req: Request, res: Response) => {
  try {
    const stores = await storeCtrl.getByOwner(req.params.ownerId)
    res.json(stores)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/stores/nearby', async (req: Request, res: Response) => {
  try {
    const lat = Number(req.query.lat)
    const lng = Number(req.query.lng)
    const radius = Number(req.query.radiusKm) || Number(req.query.radius) || 5
    const stores = await storeCtrl.getNearby(lat, lng, radius)
    res.json(stores)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.put('/stores/:id', async (req: Request, res: Response) => {
  try {
    const updated = await storeCtrl.update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Store not found' })
    res.json(updated)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.post('/stores/:id/approve', async (req: Request, res: Response) => {
  try {
    const approved = await storeCtrl.approve(req.params.id)
    if (!approved) return res.status(404).json({ error: 'Store not found' })
    res.json(approved)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

// Products
router.post('/products', async (req: Request, res: Response) => {
  try {
    const product = await productCtrl.create(req.body)
    res.status(201).json(product)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const p = await productCtrl.getById(req.params.id)
    if (!p) return res.status(404).json({ error: 'Product not found' })
    res.json(p)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/products/store/:storeId', async (req: Request, res: Response) => {
  try {
    const list = await productCtrl.getByStore(req.params.storeId)
    res.json(list)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/products', async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || '')
    if (q) {
      const list = await productCtrl.search(q)
      return res.json(list)
    }
    res.json([])
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const updated = await productCtrl.update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Product not found' })
    res.json(updated)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const ok = await productCtrl.delete(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Product not found' })
    res.status(204).send()
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

// Orders
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const order = await orderCtrl.create(req.body)
    res.status(201).json(order)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const o = await orderCtrl.getById(req.params.id)
    if (!o) return res.status(404).json({ error: 'Order not found' })
    res.json(o)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/orders/user/:userId', async (req: Request, res: Response) => {
  try {
    const list = await orderCtrl.getByUser(req.params.userId)
    res.json(list)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/orders/store/:storeId', async (req: Request, res: Response) => {
  try {
    const list = await orderCtrl.getByStore(req.params.storeId)
    res.json(list)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.post('/orders/:id/confirm', async (req: Request, res: Response) => {
  try {
    const o = await orderCtrl.confirm(req.params.id)
    if (!o) return res.status(404).json({ error: 'Order not found' })
    res.json(o)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.post('/orders/:id/cancel', async (req: Request, res: Response) => {
  try {
    const o = await orderCtrl.cancel(req.params.id)
    if (!o) return res.status(404).json({ error: 'Order not found' })
    res.json(o)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

export default router
