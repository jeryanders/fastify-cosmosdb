import { CosmosClient, CosmosClientOptions, DatabaseDefinition, Resource, FeedResponse, Container } from "@azure/cosmos";

const normalizeSnakeCase = (str: string) => {
  return str.split('-').map((word: string, index: number) => {
    if (index === 0) return word.toLowerCase()

    return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
  }).join('');
}

const camelize = (str: string) => {
  if (str.indexOf('-') > 0) return normalizeSnakeCase(str)
  return str.replace(/(?:^\w|[A-Z ]|\b\w)/g, function (word: string, index: number) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

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

type FastifyContainers = {
  [key: string]: Container
}

export type FastifyCosmosDbClient = {
  [key: string]: FastifyContainers
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
