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
  describe('without filtering', () => {
    const server: FastifyInstance = buildServer()

    beforeEach(() => (
      server.inject({ url: '/' })
    ))

    it('should add cosmos decoration', () => (
      expect(server.cosmos).toBeTruthy()
    ))

    it('expected to read all databases', () => (
      expect(mockDatabaseList.readAll).toHaveBeenCalled()
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
})
