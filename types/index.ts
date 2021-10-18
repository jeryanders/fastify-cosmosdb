import { Container, Database, CosmosClientOptions } from "@azure/cosmos";

export type FastifyContainers = {
  [key: string]: Container
}

export type FastifyDatabases = {
  [key: string]: Database | FastifyContainers

}

export type FastifyCosmosDbClient = {
  [key: string]: FastifyContainers
}

export type ContainerFilters = {
  [key: string]: boolean
}

export type DatabaseFilters = {
  id: string
  containers: ContainerFilters
}

export type CosmosPluginOptions = {
  clientOptions: CosmosClientOptions
  databases?: DatabaseFilters[]
}

declare module 'fastify' {
  interface FastifyInstance {
    cosmos: CosmosDbContext
  }
}

export type CosmosDbConfiguration = {
  databaseName: string
  containerIds: string[]
}

export type CosmosDbContext = {
  database: Database
}

export type CosmosDbContainerContext = {
  [key: string]: Container
}
