import { StoreService } from '../../services/StoreService'
import { StoreRepository } from '../../repositories/StoreRepository'
import { Store, StoreStatus } from '../../models/Store'

jest.mock('../../repositories/StoreRepository')

describe('StoreService', () => {
  let storeService: StoreService
  let mockStoreRepository: jest.Mocked<StoreRepository>

  const mockStore: Store = {
    id: 'store-123',
    ownerId: 'user-456',
    name: 'Loja Teste',
    slug: 'loja-teste',
    description: 'Descrição da loja teste',
    phone: '11999999999',
    email: 'loja@teste.com',
    address: 'Rua Teste, 123',
    city: 'São Paulo',
    state: 'SP',
    latitude: -23.5505,
    longitude: -46.6333,
    status: StoreStatus.ACTIVE,
    deliveryFee: 5.0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    storeService = new StoreService()
    mockStoreRepository = (storeService as any)
      .storeRepository as jest.Mocked<StoreRepository>
  })

  describe('createStore', () => {
    it('deve criar uma loja com sucesso', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(null)
      mockStoreRepository.create.mockResolvedValue(mockStore)

      const result = await storeService.createStore({
        name: 'Loja Teste',
        ownerId: 'user-456',
      })

      expect(result).toEqual(mockStore)
      expect(mockStoreRepository.create).toHaveBeenCalled()
    })

    it('deve lançar erro quando nome não é fornecido', async () => {
      await expect(
        storeService.createStore({
          ownerId: 'user-456',
        })
      ).rejects.toThrow('Nome e proprietário são obrigatórios')
    })

    it('deve lançar erro quando ownerId não é fornecido', async () => {
      await expect(
        storeService.createStore({
          name: 'Loja Teste',
        })
      ).rejects.toThrow('Nome e proprietário são obrigatórios')
    })

    it('deve lançar erro quando já existe loja com mesmo slug', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(mockStore)

      await expect(
        storeService.createStore({
          name: 'Loja Teste',
          ownerId: 'user-456',
        })
      ).rejects.toThrow('Já existe uma loja com este nome')
    })

    it('deve gerar slug automaticamente quando não fornecido', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(null)
      mockStoreRepository.create.mockResolvedValue(mockStore)

      await storeService.createStore({
        name: 'Loja Teste Com Acentuação',
        ownerId: 'user-456',
      })

      expect(mockStoreRepository.findBySlug).toHaveBeenCalledWith(
        'loja-teste-com-acentuacao'
      )
    })

    it('deve usar slug fornecido', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(null)
      mockStoreRepository.create.mockResolvedValue(mockStore)

      await storeService.createStore({
        name: 'Loja Teste',
        ownerId: 'user-456',
        slug: 'meu-slug-customizado',
      })

      expect(mockStoreRepository.findBySlug).toHaveBeenCalledWith(
        'meu-slug-customizado'
      )
    })

    it('deve definir status PENDING_APPROVAL por padrão', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(null)
      mockStoreRepository.create.mockResolvedValue(mockStore)

      await storeService.createStore({
        name: 'Loja Teste',
        ownerId: 'user-456',
      })

      expect(mockStoreRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: StoreStatus.PENDING_APPROVAL,
        })
      )
    })
  })

  describe('getStoreById', () => {
    it('deve retornar loja quando encontrada', async () => {
      mockStoreRepository.findById.mockResolvedValue(mockStore)

      const result = await storeService.getStoreById('store-123')

      expect(result).toEqual(mockStore)
      expect(mockStoreRepository.findById).toHaveBeenCalledWith('store-123')
    })

    it('deve retornar null quando loja não encontrada', async () => {
      mockStoreRepository.findById.mockResolvedValue(null)

      const result = await storeService.getStoreById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getStoreBySlug', () => {
    it('deve retornar loja quando encontrada', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(mockStore)

      const result = await storeService.getStoreBySlug('loja-teste')

      expect(result).toEqual(mockStore)
      expect(mockStoreRepository.findBySlug).toHaveBeenCalledWith('loja-teste')
    })

    it('deve retornar null quando slug não encontrado', async () => {
      mockStoreRepository.findBySlug.mockResolvedValue(null)

      const result = await storeService.getStoreBySlug('slug-inexistente')

      expect(result).toBeNull()
    })
  })

  describe('getStoresByOwner', () => {
    it('deve retornar lojas do proprietário', async () => {
      const stores = [mockStore, { ...mockStore, id: 'store-456' }]
      mockStoreRepository.findByOwnerId.mockResolvedValue(stores)

      const result = await storeService.getStoresByOwner('user-456')

      expect(result).toEqual(stores)
      expect(mockStoreRepository.findByOwnerId).toHaveBeenCalledWith('user-456')
    })

    it('deve retornar lista vazia quando proprietário não tem lojas', async () => {
      mockStoreRepository.findByOwnerId.mockResolvedValue([])

      const result = await storeService.getStoresByOwner('user-without-stores')

      expect(result).toEqual([])
    })
  })

  describe('getNearbyStores', () => {
    it('deve retornar lojas próximas ativas', async () => {
      const nearbyStores = [mockStore]
      mockStoreRepository.findNearby.mockResolvedValue(nearbyStores)

      const result = await storeService.getNearbyStores(-23.55, -46.63, 10)

      expect(result).toEqual(nearbyStores)
      expect(mockStoreRepository.findNearby).toHaveBeenCalledWith(
        -23.55,
        -46.63,
        10
      )
    })

    it('deve usar raio padrão de 10km quando não especificado', async () => {
      mockStoreRepository.findNearby.mockResolvedValue([])

      await storeService.getNearbyStores(-23.55, -46.63)

      expect(mockStoreRepository.findNearby).toHaveBeenCalledWith(
        -23.55,
        -46.63,
        10
      )
    })

    it('deve filtrar lojas não ativas', async () => {
      const mixedStores = [
        mockStore,
        { ...mockStore, id: 'store-inactive', status: StoreStatus.INACTIVE },
        {
          ...mockStore,
          id: 'store-pending',
          status: StoreStatus.PENDING_APPROVAL,
        },
      ]
      mockStoreRepository.findNearby.mockResolvedValue(mixedStores)

      const result = await storeService.getNearbyStores(-23.55, -46.63)

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe(StoreStatus.ACTIVE)
    })
  })

  describe('updateStore', () => {
    it('deve atualizar loja com sucesso', async () => {
      const updatedStore = { ...mockStore, name: 'Loja Atualizada' }
      mockStoreRepository.findById.mockResolvedValue(mockStore)
      mockStoreRepository.update.mockResolvedValue(updatedStore)

      const result = await storeService.updateStore('store-123', {
        name: 'Loja Atualizada',
      })

      expect(result).toEqual(updatedStore)
      expect(mockStoreRepository.update).toHaveBeenCalledWith(
        'store-123',
        expect.objectContaining({ name: 'Loja Atualizada' })
      )
    })

    it('deve lançar erro quando loja não encontrada', async () => {
      mockStoreRepository.findById.mockResolvedValue(null)

      await expect(
        storeService.updateStore('non-existent', { name: 'Novo Nome' })
      ).rejects.toThrow('Loja não encontrada')
    })
  })

  describe('approveStore', () => {
    it('deve aprovar loja com sucesso', async () => {
      const approvedStore = { ...mockStore, status: StoreStatus.ACTIVE }
      mockStoreRepository.findById.mockResolvedValue(mockStore)
      mockStoreRepository.update.mockResolvedValue(approvedStore)

      const result = await storeService.approveStore('store-123')

      expect(result).toEqual(approvedStore)
      expect(mockStoreRepository.update).toHaveBeenCalledWith(
        'store-123',
        expect.objectContaining({ status: StoreStatus.ACTIVE })
      )
    })

    it('deve lançar erro quando loja não encontrada', async () => {
      mockStoreRepository.findById.mockResolvedValue(null)

      await expect(storeService.approveStore('non-existent')).rejects.toThrow(
        'Loja não encontrada'
      )
    })
  })

  describe('suspendStore', () => {
    it('deve suspender loja com sucesso', async () => {
      const suspendedStore = { ...mockStore, status: StoreStatus.INACTIVE }
      mockStoreRepository.findById.mockResolvedValue(mockStore)
      mockStoreRepository.update.mockResolvedValue(suspendedStore)

      const result = await storeService.suspendStore('store-123')

      expect(result).toEqual(suspendedStore)
      expect(mockStoreRepository.update).toHaveBeenCalledWith(
        'store-123',
        expect.objectContaining({ status: StoreStatus.INACTIVE })
      )
    })

    it('deve lançar erro quando loja não encontrada', async () => {
      mockStoreRepository.findById.mockResolvedValue(null)

      await expect(storeService.suspendStore('non-existent')).rejects.toThrow(
        'Loja não encontrada'
      )
    })
  })
})

