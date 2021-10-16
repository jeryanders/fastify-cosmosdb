import { CosmosClient, CosmosClientOptions, DatabaseDefinition, Resource, FeedResponse } from "@azure/cosmos";
import { camelize } from '../utils'

const initializeContainer = (client: CosmosClient, databaseId: string) => (containerId: string) => ([
  camelize(containerId),
  client.database(databaseId)
    .container(containerId)
])

const initializeDatabase = (client: CosmosClient) => (databaseId: string) => ([
  camelize(databaseId),
  client.database(databaseId)
    .containers.readAll().fetchAll()
    .then(({ resources }) => {
      const containerIds = resources.map((resource) => resource.id)
      return Object.fromEntries(containerIds.map((initializeContainer(client, databaseId))))
    })
])

// TODO: Find generic constructs that work here. ReturnType of 'any' is not good
function resolveAll<T> (promises: Promise<T>[]): any{
  return Promise.all(
    promises.map((promise: Promise<T>) => {
      if (promise.then) {
        return promise
          .then((toResolve: (PromiseLike<T> | T)) =>
                Array.isArray(toResolve)
                  ? Promise.all(toResolve.map((resolve) => resolveAll(resolve)))
                  : toResolve)
      }

      return promise
    }))
}

const processDatabases = (client: CosmosClient) => (databases: FeedResponse<DatabaseDefinition & Resource>): (string | Promise<any>)[][] => {
  const databaseIds = databases.resources.map((resource) => resource.id)
  const initializingDatabases = databaseIds.map(initializeDatabase(client))
  return initializingDatabases
}

const context = (options: CosmosClientOptions): Promise<FastifyCosmosDbClient> => {
  const cosmosClient = new CosmosClient(options)

  return cosmosClient.databases.readAll().fetchAll()
    .then(processDatabases(cosmosClient))
    .then((databases) => Promise.all(databases.map((database: any) => resolveAll<FastifyContainers>(database))))
    .then(Object.fromEntries)
}

export default context
