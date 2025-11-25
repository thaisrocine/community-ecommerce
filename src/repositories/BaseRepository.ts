export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(filters?: Record<string, any>): Promise<T[]>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
  }

  async findById(_id: string): Promise<T | null> {
    throw new Error('Method not implemented - connect database first')
  }

  async findAll(_filters?: Record<string, any>): Promise<T[]> {
    throw new Error('Method not implemented - connect database first')
  }

  async create(_data: Partial<T>): Promise<T> {
    throw new Error('Method not implemented - connect database first')
  }

  async update(_id: string, _data: Partial<T>): Promise<T | null> {
    throw new Error('Method not implemented - connect database first')
  }

  async delete(_id: string): Promise<boolean> {
    throw new Error('Method not implemented - connect database first')
  }
}
