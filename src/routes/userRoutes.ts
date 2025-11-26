import { Router, Request, Response } from 'express'
import { UserController } from '../controllers/UserController'

const router = Router()
const userController = new UserController()

router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await userController.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await userController.login(email, password)

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userController.getById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userController.update(req.params.id, req.body)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

// DELETE /api/users/:id - Deletar usuário
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await userController.delete(req.params.id)

    if (!success) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
})

export default router
