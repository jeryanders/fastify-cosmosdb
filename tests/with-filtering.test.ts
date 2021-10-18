
import {FastifyInstance} from 'fastify'
import mockAzureCosmos, { buildServer } from './support'

const { mockDatabase, mockDatabaseList, mockContainer} = mockAzureCosmos();

jest.mock('@azure/cosmos', () => {
  class MockCosmosDbClient {
    database
    databases
    constructor() {
      this.database = mockDatabase
      this.databases = mockDatabaseList
    }
  }

  return {
    CosmosClient: MockCosmosDbClient
  }
})


describe('plugin tests', () => {
  describe('with filtering', () => {
    const server: FastifyInstance = buildServer([
      {
        id: 'database-two',
        containers: {
          'PascalCaseContainerName': true,
          'camelCaseContainerName': true
        }
      }
    ])

    beforeEach(() => (
      server.inject({ url: '/' })
    ))

    it('should create cosmosdb context', () => (
      expect(server.cosmos).toBeTruthy()
    ))

    it('expected to read all databases', () => (
      expect(mockDatabaseList.readAll).toHaveBeenCalled()
    ))

    it('should call database with configuration', () => (
      expect(mockContainer.mock.calls).toEqual([
        ['PascalCaseContainerName'],
        ['camelCaseContainerName']
      ])
    ))

    it('should camelize all container names as properties on container context', () => (
      expect(server.cosmos).toEqual({
        "databaseTwo": {
          "camelCaseContainerName": {
            "id": "second-retrieved-container",
          },
          "pascalCaseContainerName":{
            "id": "first-retrieved-container",
          },
        }
      })
    ))
  })
})
