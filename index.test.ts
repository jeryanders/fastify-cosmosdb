import fastify from 'fastify'
import fastifyCosmosDb from './index'

const mockContainer = jest.fn()
  .mockReturnValueOnce({
    id: 'first-retrieved-container'
  })
  .mockReturnValueOnce({
    id: 'second-retrieved-container'
  })
  .mockReturnValueOnce({
    id: 'third-retrieved-container'
  })
  .mockReturnValueOnce({
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

const mockDatabases = {
  readAll: jest.fn().mockReturnValueOnce({
    fetchAll: jest.fn().mockResolvedValue({
      resources: [
        { id: 'database-one' },
        { id: 'database-two' }
      ]
    })
  })
};

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

describe('plugin tests', () => {
  describe('without filtering', () => {
    const server = fastify()
    beforeEach(() => {
      return server.register(fastifyCosmosDb, {
        clientOptions: {
          endpoint: 'cosmos-endpoint'
        }
      })
    })

    it('should create cosmosdb context', () => (
      expect(server.cosmos).toBeTruthy()
    ))

    it('expected to read all databases', () => (
      expect(mockDatabases.readAll).toHaveBeenCalled()
    ))

    it('should call database with configuration', () => (
      expect(mockContainer.mock.calls).toEqual([
        ['PascalCaseContainerName'],
        ['camelCaseContainerName'],
        ['snake-case-container-name'],
        ['spaced out container name']
      ])
    ))

    it('should camelize all container names as properties on container context', () => (
      expect(server.cosmos).toEqual({
        "databaseOne": {
          "camelCaseContainerName": {
            "id": "second-retrieved-container",
          },
          "pascalCaseContainerName":{
            "id": "first-retrieved-container",
          },
        },
        "databaseTwo": {
          "snakeCaseContainerName": {
            "id": "third-retrieved-container",
          },
          "spacedOutContainerName": {
            "id": "fourth-retrieved-container",
          },
        }
      })
    ))
  })

  describe('with filtering', () => {
    const server = fastify()
    beforeEach(() => {
      return server.register(fastifyCosmosDb, {
        clientOptions: {
          endpoint: 'cosmos-endpoint'
        },
        databases: [
          {
            id: 'database-one',
            containers: {
              'spaced out container name': true,
              'snake-case-container-name': true
            }
          }
        ]
      })
    })

    it('should create cosmosdb context', () => (
      expect(server.cosmos).toBeTruthy()
    ))

    it('expected to read all databases', () => (
      expect(mockDatabases.readAll).toHaveBeenCalled()
    ))

    it('should call database with configuration', () => (
      expect(mockContainer.mock.calls).toEqual([
        ['PascalCaseContainerName'],
        ['camelCaseContainerName'],
        ['snake-case-container-name'],
        ['spaced out container name']
      ])
    ))

    it('should camelize all container names as properties on container context', () => (
      expect(server.cosmos).toEqual({
        "databaseOne": {
          "camelCaseContainerName": {
            "id": "second-retrieved-container",
          },
          "pascalCaseContainerName":{
            "id": "first-retrieved-container",
          },
        },
        "databaseTwo": {
          "snakeCaseContainerName": {
            "id": "third-retrieved-container",
          },
          "spacedOutContainerName": {
            "id": "fourth-retrieved-container",
          },
        }
      })
    ))
  });
})
