import {CosmosClient, CosmosClientOptions} from '@azure/cosmos';
import { FastifyPlugin } from 'fastify'

interface PluginOptions {
}

export interface cosmosDb {
  (config: CosmosClientOptions): CosmosClient
}

declare module 'fastify' {
  interface FastifyInstance {
    cosmosDb: cosmosDb
  }
}

export const cosmosDb: FastifyPlugin<PluginOptions>

export default cosmosDb
