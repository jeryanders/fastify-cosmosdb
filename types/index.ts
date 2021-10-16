import { Container, Database } from "@azure/cosmos";

export type FastifyContainers = {
  [key: string]: Container
}

export type FastifyCosmosDbClient = {
  [key: string]: FastifyContainers
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
