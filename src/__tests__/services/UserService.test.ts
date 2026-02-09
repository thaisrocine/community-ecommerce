import { UserService } from '../../services/UserService'
import { UserRepository } from '../../repositories/UserRepository'
import { User, UserRole, UserStatus } from '../../models/User'

jest.mock('../../repositories/UserRepository')

describe('UserService', () => {
  let userService: UserService
  let mockUserRepository: jest.Mocked<UserRepository>

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'Test User',
    phone: '11999999999',
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    userService = new UserService()
    mockUserRepository = (userService as any)
      .userRepository as jest.Mocked<UserRepository>
  })

  describe('createUser', () => {
    it('deve criar um usuário com sucesso', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.create.mockResolvedValue(mockUser)

      const result = await userService.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      )
      expect(mockUserRepository.create).toHaveBeenCalled()
    })

    it('deve lançar erro quando email já existe', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser)

      await expect(
        userService.createUser({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow('Email já cadastrado')
    })

    it('deve lançar erro quando campos obrigatórios não são fornecidos', async () => {
      await expect(userService.createUser({ email: 'test@example.com' })).rejects.toThrow(
        'Email, senha e nome são obrigatórios'
      )

      await expect(userService.createUser({ password: 'password123' })).rejects.toThrow(
        'Email, senha e nome são obrigatórios'
      )

      await expect(userService.createUser({ name: 'Test' })).rejects.toThrow(
        'Email, senha e nome são obrigatórios'
      )
    })

    it('deve definir status e role padrão quando não fornecidos', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.create.mockResolvedValue(mockUser)

      await userService.createUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: UserStatus.ACTIVE,
          role: UserRole.CLIENT,
        })
      )
    })
  })

  describe('getUserById', () => {
    it('deve retornar usuário quando encontrado', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser)

      const result = await userService.getUserById('user-123')

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123')
    })

    it('deve retornar null quando usuário não encontrado', async () => {
      mockUserRepository.findById.mockResolvedValue(null)

      const result = await userService.getUserById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('deve retornar usuário quando encontrado', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser)

      const result = await userService.getUserByEmail('test@example.com')

      expect(result).toEqual(mockUser)
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      )
    })

    it('deve retornar null quando email não encontrado', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null)

      const result = await userService.getUserByEmail('notfound@example.com')

      expect(result).toBeNull()
    })
  })

  describe('updateUser', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' }
      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.update.mockResolvedValue(updatedUser)

      const result = await userService.updateUser('user-123', {
        name: 'Updated Name',
      })

      expect(result).toEqual(updatedUser)
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({ name: 'Updated Name' })
      )
    })

    it('deve lançar erro quando usuário não encontrado', async () => {
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        userService.updateUser('non-existent', { name: 'New Name' })
      ).rejects.toThrow('Usuário não encontrado')
    })

    it('não deve permitir alterar id e createdAt', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser)
      mockUserRepository.update.mockResolvedValue(mockUser)

      await userService.updateUser('user-123', {
        id: 'new-id',
        createdAt: new Date(),
        name: 'New Name',
      } as any)

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        'user-123',
        expect.not.objectContaining({ id: 'new-id' })
      )
    })
  })

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      mockUserRepository.delete.mockResolvedValue(true)

      const result = await userService.deleteUser('user-123')

      expect(result).toBe(true)
      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-123')
    })

    it('deve retornar false quando usuário não existe', async () => {
      mockUserRepository.delete.mockResolvedValue(false)

      const result = await userService.deleteUser('non-existent')

      expect(result).toBe(false)
    })
  })

  describe('getUsersByRole', () => {
    it('deve retornar usuários por role', async () => {
      const adminUsers = [{ ...mockUser, role: UserRole.ADMIN }]
      mockUserRepository.findByRole.mockResolvedValue(adminUsers)

      const result = await userService.getUsersByRole(UserRole.ADMIN)

      expect(result).toEqual(adminUsers)
      expect(mockUserRepository.findByRole).toHaveBeenCalledWith(UserRole.ADMIN)
    })

    it('deve retornar lista vazia quando não há usuários com role', async () => {
      mockUserRepository.findByRole.mockResolvedValue([])

      const result = await userService.getUsersByRole(UserRole.STORE_OWNER)

      expect(result).toEqual([])
    })
  })

  describe('authenticateUser', () => {
    it('deve retornar usuário quando email existe', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser)

      const result = await userService.authenticateUser(
        'test@example.com',
        'password123'
      )

      expect(result).toEqual(mockUser)
    })

    it('deve retornar null quando email não existe', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null)

      const result = await userService.authenticateUser(
        'notfound@example.com',
        'password123'
      )

      expect(result).toBeNull()
    })
  })
})

