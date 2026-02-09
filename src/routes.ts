import express, { Request, Response } from 'express'
import { UserController } from './controllers/UserController'
import { StoreController } from './controllers/StoreController'
import { ProductController } from './controllers/ProductController'
import { OrderController } from './controllers/OrderController'
import { ReviewController } from './controllers/ReviewController'
import { AuthController } from './controllers/AuthController'
import { authenticate, authorize } from './middlewares/authMiddleware'
import { UserRole } from './models/User'

const router = express.Router()

const userCtrl = new UserController()
const storeCtrl = new StoreController()
const productCtrl = new ProductController()
const orderCtrl = new OrderController()
const reviewCtrl = new ReviewController()
const authCtrl = new AuthController()

// ==================== AUTH ROUTES ====================

// Registro de novo usuário
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const result = await authCtrl.register(req.body)
    return res.status(201).json(result)
  } catch (err: any) {
    return res.status(400).json({ error: err.message || String(err) })
  }
})

// Login
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const result = await authCtrl.login(req.body)
    return res.status(200).json(result)
  } catch (err: any) {
    return res.status(401).json({ error: err.message || String(err) })
  }
})

// Refresh token
router.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    const result = await authCtrl.refreshToken(refreshToken)
    return res.status(200).json(result)
  } catch (err: any) {
    return res.status(401).json({ error: err.message || String(err) })
  }
})

// Obter perfil do usuário autenticado
router.get('/auth/me', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await authCtrl.getProfile(req.user!.userId)
    return res.status(200).json(result)
  } catch (err: any) {
    return res.status(400).json({ error: err.message || String(err) })
  }
})

// Alterar senha
router.post('/auth/change-password', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    await authCtrl.changePassword(req.user!.userId, currentPassword, newPassword)
    return res.status(200).json({ message: 'Senha alterada com sucesso' })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || String(err) })
  }
})

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
router.post('/stores', authenticate, authorize(UserRole.STORE_OWNER, UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const store = await storeCtrl.create({ ...req.body, ownerId: req.user!.userId })
    return res.status(201).json(store)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
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

// Atualizar loja (requer autenticação)
router.put('/stores/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const updated = await storeCtrl.update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Store not found' })
    return res.json(updated)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Aprovar loja (somente ADMIN)
router.post('/stores/:id/approve', authenticate, authorize(UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const approved = await storeCtrl.approve(req.params.id)
    if (!approved) return res.status(404).json({ error: 'Store not found' })
    return res.json(approved)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})


router.post('/products', authenticate, authorize(UserRole.STORE_OWNER, UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const product = await productCtrl.create(req.body)
    return res.status(201).json(product)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
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

// Deletar produto (requer autenticação)
router.delete('/products/:id', authenticate, authorize(UserRole.STORE_OWNER, UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const ok = await productCtrl.delete(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Product not found' })
    return res.status(204).send()
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Orders
// Criar pedido (requer autenticação)
router.post('/orders', authenticate, async (req: Request, res: Response) => {
  try {
    const order = await orderCtrl.create({ ...req.body, userId: req.user!.userId })
    return res.status(201).json(order)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Buscar pedido por ID (requer autenticação)
router.get('/orders/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const o = await orderCtrl.getById(req.params.id)
    if (!o) return res.status(404).json({ error: 'Order not found' })
    return res.json(o)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Buscar pedidos do usuário (requer autenticação)
router.get('/orders/user/:userId', authenticate, async (req: Request, res: Response) => {
  try {
    const list = await orderCtrl.getByUser(req.params.userId)
    return res.json(list)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Buscar pedidos da loja (requer autenticação - STORE_OWNER ou ADMIN)
router.get('/orders/store/:storeId', authenticate, authorize(UserRole.STORE_OWNER, UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const list = await orderCtrl.getByStore(req.params.storeId)
    return res.json(list)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Confirmar pedido (requer autenticação - STORE_OWNER ou ADMIN)
router.post('/orders/:id/confirm', authenticate, authorize(UserRole.STORE_OWNER, UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const o = await orderCtrl.confirm(req.params.id)
    if (!o) return res.status(404).json({ error: 'Order not found' })
    return res.json(o)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Cancelar pedido (requer autenticação)
router.post('/orders/:id/cancel', authenticate, async (req: Request, res: Response) => {
  try {
    const o = await orderCtrl.cancel(req.params.id)
    if (!o) return res.status(404).json({ error: 'Order not found' })
    return res.json(o)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Reviews
// Criar review (requer autenticação)
router.post('/reviews', authenticate, async (req: Request, res: Response) => {
  try {
    const review = await reviewCtrl.create({ ...req.body, userId: req.user!.userId })
    return res.status(201).json(review)
  } catch (err: any) {
    return res.status(400).json({ error: err.message || String(err) })
  }
})

router.get('/reviews/:id', async (req: Request, res: Response) => {
  try {
    const review = await reviewCtrl.getById(req.params.id)
    if (!review) return res.status(404).json({ error: 'Review not found' })
    return res.json(review)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/reviews/store/:storeId', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewCtrl.getByStore(req.params.storeId)
    res.json(reviews)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/reviews/user/:userId', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewCtrl.getByUser(req.params.userId)
    res.json(reviews)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/reviews/store/:storeId/stats', async (req: Request, res: Response) => {
  try {
    const stats = await reviewCtrl.getStoreStats(req.params.storeId)
    res.json(stats)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

// Atualizar review (requer autenticação)
router.put('/reviews/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const updated = await reviewCtrl.update(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Review not found' })
    return res.json(updated)
  } catch (err: any) {
    return res.status(400).json({ error: err.message || String(err) })
  }
})

// Deletar review (requer autenticação)
router.delete('/reviews/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const ok = await reviewCtrl.delete(req.params.id)
    if (!ok) return res.status(404).json({ error: 'Review not found' })
    return res.status(204).send()
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Aprovar review (somente ADMIN)
router.post('/reviews/:id/approve', authenticate, authorize(UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const approved = await reviewCtrl.approve(req.params.id)
    if (!approved) return res.status(404).json({ error: 'Review not found' })
    return res.json(approved)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Rejeitar review (somente ADMIN)
router.post('/reviews/:id/reject', authenticate, authorize(UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const rejected = await reviewCtrl.reject(req.params.id)
    if (!rejected) return res.status(404).json({ error: 'Review not found' })
    return res.json(rejected)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

// Responder review (requer autenticação - STORE_OWNER)
router.post('/reviews/:id/respond', authenticate, authorize(UserRole.STORE_OWNER, UserRole.ADMIN), async (req: Request, res: Response) => {
  try {
    const { response } = req.body
    if (!response) {
      return res.status(400).json({ error: 'response is required' })
    }
    const updated = await reviewCtrl.respond(req.params.id, req.user!.userId, response)
    if (!updated) return res.status(404).json({ error: 'Review not found' })
    return res.json(updated)
  } catch (err: any) {
    return res.status(400).json({ error: err.message || String(err) })
  }
})

router.post('/reviews/:id/helpful', async (req: Request, res: Response) => {
  try {
    const updated = await reviewCtrl.markHelpful(req.params.id)
    if (!updated) return res.status(404).json({ error: 'Review not found' })
    return res.json(updated)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

router.post('/reviews/:id/not-helpful', async (req: Request, res: Response) => {
  try {
    const updated = await reviewCtrl.markNotHelpful(req.params.id)
    if (!updated) return res.status(404).json({ error: 'Review not found' })
    return res.json(updated)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/reviews/top-stores', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10
    const topStores = await reviewCtrl.getTopRatedStores(limit)
    res.json(topStores)
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) })
  }
})

// Listar reviews pendentes (somente ADMIN)
router.get('/reviews/pending', authenticate, authorize(UserRole.ADMIN), async (_req: Request, res: Response) => {
  try {
    const pending = await reviewCtrl.getPending()
    return res.json(pending)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

router.get('/reviews/can-review', async (req: Request, res: Response) => {
  try {
    const { userId, storeId } = req.query
    if (!userId || !storeId) {
      return res.status(400).json({ error: 'userId and storeId are required' })
    }
    const canReview = await reviewCtrl.canUserReview(
      String(userId),
      String(storeId)
    )
    return res.json({ canReview })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
})

export default router
