import { CosmosClient, CosmosClientOptions, DatabaseDefinition, Resource, FeedResponse } from "@azure/cosmos";
import { camelize } from '../utils'

import type { FastifyCosmosDbClient } from '../types'

const initializeContainer = (client: CosmosClient, databaseId: string) => (containerId: string) => ([
  camelize(containerId),
  client.database(databaseId)
    .container(containerId)
])

const initializeDatabase = (client: CosmosClient) => (databaseId: string) => ([
  camelize(databaseId),
  client.database(databaseId).containers
    .readAll()
    .fetchAll()
    .then(({ resources }) => {
      const containerIds = resources.map((resource) => resource.id)
      return containerIds.map((initializeContainer(client, databaseId)));
    }).then(Object.fromEntries)
])

// TODO: Find generic constructs that work here. ReturnType of 'any' is not good
function resolveAll<T> (promises: Promise<T>[]): any{
  return Promise.all(promises.map((promise: any) => (
    Array.isArray(promise) ? Promise.all(promise) : Promise.resolve(promise)
  )))
}

const processDatabases = (client: CosmosClient) => (databases: FeedResponse<DatabaseDefinition & Resource>): any => {
  const databaseIds = databases.resources.map((resource) => resource.id)
  const initializingDatabases = databaseIds.map(initializeDatabase(client))
  return Promise.all(initializingDatabases)
}

const context = (options: CosmosClientOptions): Promise<FastifyCosmosDbClient> => {
  const cosmosClient = new CosmosClient(options)

  return cosmosClient.databases
    .readAll()
    .fetchAll()
    .then(processDatabases(cosmosClient))
    .then((databases) => Promise.all(databases.map((database: any) => resolveAll<any[][]>(database))))
    .then((result: any) => Object.fromEntries(result))
}

export default context
