import { Container, CosmosClientOptions, Database } from "@azure/cosmos";

type FastifyContainers = {
  [key: string]: Container
}

export type FastifyCosmosDbClient = {
  [key: string]: FastifyContainers
}

declare module 'fastify' {
  interface FastifyInstance {
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
