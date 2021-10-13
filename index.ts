import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import { CosmosClientOptions, CosmosClient } from '@azure/cosmos'
import { CosmosDbConfiguration, CosmosPluginOptions, CosmosDbContext } from './index.d'

function camelize (str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

const getCosmosDbClientFactory = (options: CosmosClientOptions, configuration: CosmosDbConfiguration): CosmosDbContext => {
  const cosmosClient = new CosmosClient(options)
  const database = cosmosClient.database(configuration.databaseName)
  const containerContextPairs = configuration.containerIds.map((containerId) => ([camelize(containerId), database.container(containerId)]))
  const containerContexts = Object.fromEntries(containerContextPairs)
  return {
    database,
    ...containerContexts
  }
}

// define plugin using callbacks
const cosmosDb: FastifyPluginCallback<CosmosPluginOptions> = (fastify, options, done) => {
  if (fastify.cosmosDbClient) {
    fastify.decorate('cosmosDbClient', getCosmosDbClientFactory(options.cosmosOptions, options.cosmosConfiguration))
  }

  done()
}

export default fp(cosmosDb, '3.x')
