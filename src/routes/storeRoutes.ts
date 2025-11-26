import { Router, Request, Response } from 'express'
import { StoreController } from '../controllers/StoreController'

const router = Router()
const storeController = new StoreController()

// POST /api/stores - Criar loja
router.post('/', async (req: Request, res: Response) => {
  try {
    const store = await storeController.create(req.body)
    res.status(201).json(store)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/stores/:id - Buscar loja por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const store = await storeController.getById(req.params.id)

    if (!store) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    return res.json(store)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/stores/owner/:ownerId - Buscar lojas por proprietário
router.get('/owner/:ownerId', async (req: Request, res: Response) => {
  try {
    const stores = await storeController.getByOwner(req.params.ownerId)
    res.json(stores)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/stores/nearby - Buscar lojas próximas
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius } = req.query

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: 'Latitude e longitude são obrigatórios',
      })
    }

    const lat = parseFloat(latitude as string)
    const lng = parseFloat(longitude as string)
    const radiusKm = radius ? parseFloat(radius as string) : 10

    const stores = await storeController.getNearby(lat, lng, radiusKm)
    res.json(stores)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PUT /api/stores/:id - Atualizar loja
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const store = await storeController.update(req.params.id, req.body)

    if (!store) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    return res.json(store)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PATCH /api/stores/:id/approve - Aprovar loja
router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const store = await storeController.approve(req.params.id)

    if (!store) {
      return res.status(404).json({ error: 'Loja não encontrada' })
    }

    return res.json(store)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

export default router
