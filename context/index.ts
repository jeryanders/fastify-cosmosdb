import { CosmosClient, DatabaseDefinition, Resource, FeedResponse } from "@azure/cosmos";
import { camelize } from '../utils'

import type { FastifyCosmosDbClient, DatabaseFilters, FastifyContainers, CosmosPluginOptions } from '../types'

// TODO Type ReturnType
const initializeContainer = (client: CosmosClient, databaseId: string) => (containerId: string) => ([
  camelize(containerId),
  client.database(databaseId)
    .container(containerId)
])

// TODO Type ReturnType
const initializeDatabase = (client: CosmosClient, filters: DatabaseFilters[]) => (databaseId: string) => ([
  camelize(databaseId),
  client.database(databaseId).containers
    .readAll()
    .fetchAll()
    .then(({ resources }) => {
      const resourceIds = resources.map((resource) => resource.id)
      const databaseFilter = filters.findIndex(({ id }) => id === databaseId);
      if (databaseFilter > 0) {
        const { containers } = filters[databaseFilter]
        return resourceIds.filter((id) => containers[id] === true)
      }
      return resourceIds;
    }).then((containerIds) => containerIds.map((initializeContainer(client, databaseId))))
      .then(Object.fromEntries)
])

function resolveAll<T> (promises: Promise<T>[]): Promise<T[]>{
  return Promise.all(promises.map((promise: Promise<T>) => (
    Promise.resolve(promise)
  )))
}

type DatabaseContextModel = Promise<(string | Promise<FastifyContainers>)[][]>

const processDatabases = (client: CosmosClient, filters: DatabaseFilters[] = []) =>
  (databases: FeedResponse<DatabaseDefinition & Resource>): DatabaseContextModel => {

  const filterDatabases = (): string[] => {
    const resourceIds = databases.resources.map((resource) => resource.id)
    if (filters && filters.length > 0) {
      const includeDatabaseIds = filters?.map((database) => database.id)

      return resourceIds.filter((id) => includeDatabaseIds.includes(id))
    }
    return resourceIds
  }

  const filteredDatabases = filterDatabases()
  const initializingDatabases = filteredDatabases.map(initializeDatabase(client, filters))
  return Promise.all(initializingDatabases)
}

const context = ({ clientOptions, databases }: CosmosPluginOptions): Promise<FastifyCosmosDbClient> => {
  const cosmosClient = new CosmosClient(clientOptions)

  return cosmosClient.databases
    .readAll()
    .fetchAll()
    .then(processDatabases(cosmosClient, databases))
    .then((processed) => Promise.all(processed.map((database: any) => resolveAll<any[][]>(database))))
    .then((result: any) => Object.fromEntries(result))
}

export default context
