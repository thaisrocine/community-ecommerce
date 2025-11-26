import { Router, Request, Response } from 'express'
import { ProductController } from '../controllers/ProductController'

const router = Router()
const productController = new ProductController()

// POST /api/products - Criar produto
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = await productController.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/products/search - Buscar produtos
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({
        error: 'Parâmetro de busca "q" é obrigatório',
      })
    }

    const products = await productController.search(q as string)
    res.json(products)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/products/:id - Buscar produto por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productController.getById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// GET /api/products/store/:storeId - Buscar produtos por loja
router.get('/store/:storeId', async (req: Request, res: Response) => {
  try {
    const products = await productController.getByStore(req.params.storeId)
    res.json(products)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// PUT /api/products/:id - Atualizar produto
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productController.update(req.params.id, req.body)

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// DELETE /api/products/:id - Deletar produto
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await productController.delete(req.params.id)

    if (!success) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

export default router
