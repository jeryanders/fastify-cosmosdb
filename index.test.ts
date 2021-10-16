import fastify from 'fastify'
import fastifyCosmosDb from './index'

const mockContainer = jest.fn().mockReturnValue({})
const mockContainerList = jest.fn()
  .mockReturnValueOnce({
    resources: [
      { id: 'PascalCaseContainerName' },
      { id: 'camelCaseContainerName' }
    ]
  })
  .mockReturnValueOnce({
    resources: [
      { id: 'snake-case-container-name' },
      { id: 'spaced out container name' }
    ]
  })
const mockDatabase = jest.fn().mockReturnValue({
  container: mockContainer,
  containers: mockContainerList
})
const mockDatabases = jest.fn().mockReturnValue({
  readAll: jest.fn().mockReturnValueOnce({
    fetchAll: jest.fn().mockReturnValueOnce({
      resources: [
        { id: 'database-one' },
        { id: 'database-two' }
      ]
    })
  })
});

jest.mock('@azure/cosmos', () => {
  class MockCosmosDbClient {
    database
    databases
    constructor() {
      this.database = mockDatabase
      this.databases = mockDatabases
    }
  }

  return {
    CosmosClient: MockCosmosDbClient
  }
})

describe('pluginn tests', () => {
  describe('without filtering', () => {
    const server = fastify()
    beforeEach(() => {

      return server.register(fastifyCosmosDb, { endpoint: 'cosmos-endpoint' })
    })

    it('should create cosmosdb context', () => (
      expect(server.cosmosDbContext).toBeTruthy()
    ))

    it('should create cosmosdb containers', () => (
      expect(server.cosmosDbContainers).toBeTruthy()
    ))

    it('should call database with configuration', () => (
      expect(mockDatabase).toHaveBeenCalledWith('database-name')
    ))

    it('should camelize all container names as properties on container context', () => (
      expect(server.cosmosDbContainers).toEqual({
        pascalCaseContainerName: {},
        camelCaseContainerName: {},
        snakeCaseContainerName: {},
        spacedOutContainerName: {}
      })
    ));
  })
})
