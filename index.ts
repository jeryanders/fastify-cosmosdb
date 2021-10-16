import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import { CosmosClientOptions, Database, Container } from '@azure/cosmos'
import context, { FastifyCosmosDbClient } from './context/index'

export interface getCosmosDbClientFactory {
  (options: CosmosClientOptions, configuration: CosmosDbConfiguration): CosmosDbContext
}


const getCosmosDbClientFactory = (options: CosmosClientOptions): Promise<FastifyCosmosDbClient> => context(options)

// define plugin using callbacks
const cosmosDbContext: FastifyPluginCallback<CosmosPluginOptions> = (fastify, options, done) => {
  if (!fastify.cosmosDbContext) {

    fastify.decorate('cosmosDbContext', getCosmosDbClientFactory(options.cosmosOptions))
  }

  done()
}

export default fp(cosmosDbContext, '3.x')
