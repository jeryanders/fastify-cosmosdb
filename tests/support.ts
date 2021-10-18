import fastify from 'fastify'
import fastifyCosmosDb from '../index'
import { when } from 'jest-when'

import type { DatabaseFilters } from '../types'

const mockAzureCosmos = () => {

  const mockContainer = jest.fn()
//    .mockReturnValueOnce({
//      id: 'first-retrieved-container'
//    })
//    .mockReturnValueOnce({
//      id: 'second-retrieved-container'
//    })
//    .mockReturnValueOnce({
//      id: 'third-retrieved-container'
//    })
//    .mockReturnValueOnce({
//      id: 'fourth-retrieved-container'
//    })

  when(mockContainer)
    .calledWith('PascalCaseContainerName').mockReturnValue({
      id: 'first-retrieved-container'
    })
    .calledWith('camelCaseContainerName').mockReturnValue({
      id: 'second-retrieved-container'
    })
    .calledWith('snake-case-container-name').mockReturnValue({
      id: 'third-retrieved-container'
    })
    .calledWith('spaced out container name').mockReturnValue({
      id: 'fourth-retrieved-container'
    })
  const mockContainerList = {
    readAll: jest.fn().mockReturnValue({
      fetchAll: jest.fn()
        .mockResolvedValueOnce({
          resources: [
            { id: 'PascalCaseContainerName' },
            { id: 'camelCaseContainerName' }
          ]
        })
        .mockResolvedValueOnce({
          resources: [
            { id: 'snake-case-container-name' },
            { id: 'spaced out container name' }
          ]
        })
    })
  }

  const mockDatabase = jest.fn().mockReturnValue({
    container: mockContainer,
    containers: mockContainerList
  })

  const mockDatabaseList = {
    readAll: jest.fn().mockReturnValueOnce({
      fetchAll: jest.fn().mockResolvedValue({
        resources: [
          { id: 'database-one' },
          { id: 'database-two' }
        ]
      })
    })
  };

  return {
    mockDatabase,
    mockDatabaseList,
    mockContainer,
    mockContainerList
  }
}

export default mockAzureCosmos

export const buildServer = (databases?: DatabaseFilters[]) => {
  const app = fastify()
  beforeAll(() => {
    return app.register(fastifyCosmosDb, {
      clientOptions: {
        endpoint: 'cosmos-endpoint'
      },
      databases
    })
  })

  afterAll(() => {
    return app.close()
  })

  return app
}

export class MockCosmosDbClient {
  database
  databases
  constructor(mockDatabase: object, mockDatabaseList: object) {
    this.database = mockDatabase
    this.databases = mockDatabaseList
  }
}
