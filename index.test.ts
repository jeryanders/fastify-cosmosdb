import fastify from 'fastify'
import fastifyCosmosDb from './index'

const mockContainer = jest.fn().mockReturnValue({})
const mockDatabase = jest.fn().mockReturnValue({ container: mockContainer })
jest.mock('@azure/cosmos', () => {
  class MockCosmosDbClient {
    database
    constructor() {
      this.database = mockDatabase
    }
  }

  return {
    CosmosClient: MockCosmosDbClient
  }
})

describe('pluginn tests', () => {
  describe('successful scenarios', () => {
    const server = fastify()
    beforeEach(() => {

      return server.register(fastifyCosmosDb, {
        cosmosOptions: { endpoint: 'cosmos-endpoint' },
        cosmosConfiguration: { databaseName: 'database-name', containerIds: ['PascalCaseContainerName', 'camelCaseContainerName', 'snake-case-container-name'] }
      })
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
        snakeCaseContainerName: {}
      })
    ));
  })
})
