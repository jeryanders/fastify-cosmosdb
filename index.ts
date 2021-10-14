import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import { CosmosClientOptions, CosmosClient, Database, Container } from '@azure/cosmos'
import { FastifyPlugin } from 'fastify'

export interface getCosmosDbClientFactory {
  (options: CosmosClientOptions, configuration: CosmosDbConfiguration): CosmosDbContext
}

declare module 'fastify' {
  interface FastifyInstance {
    getCosmosDbClientFactory: getCosmosDbClientFactory
    cosmosDbContext: CosmosDbContext
    cosmosDbContainers: CosmosDbContainerContext
  }
}

export interface CosmosDbConfiguration {
  databaseName: string
  containerIds: string[]
}

export interface CosmosPluginOptions {
  cosmosOptions: CosmosClientOptions
  cosmosConfiguration: CosmosDbConfiguration
}

export interface CosmosDbContext {
  database: Database
}

export interface CosmosDbContainerContext {
  [key: string]: Container
}

function camelize (str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

const getCosmosDbClientFactory = (options: CosmosClientOptions, configuration: CosmosDbConfiguration): [ Database, CosmosDbContainerContext ] => {
  const cosmosClient = new CosmosClient(options)
  const database = cosmosClient.database(configuration.databaseName)
  const containerContextPairs = configuration.containerIds.map((containerId) => ([camelize(containerId), database.container(containerId)]))
  const containerContexts = Object.fromEntries(containerContextPairs)
  return [
    database,
    containerContexts
  ];
}

// define plugin using callbacks
const cosmosDbContext: FastifyPluginCallback<CosmosPluginOptions> = (fastify, options, done) => {
  if (fastify.cosmosDbContext) {
    const [database, containers] = getCosmosDbClientFactory(options.cosmosOptions, options.cosmosConfiguration)

    fastify.decorate('cosmosDbContext', database)
    fastify.decorate('cosmosDbContainers', containers)
  }

  done()
}

export default fp(cosmosDbContext, '3.x')
