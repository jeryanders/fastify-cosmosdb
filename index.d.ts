import { CosmosClient, CosmosClientOptions, Database, Container } from '@azure/cosmos'

declare module 'fastify' {
  interface FastifyInstance {
    cosmosDbClient: CosmosClient
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
  [key: string]: Container
}
