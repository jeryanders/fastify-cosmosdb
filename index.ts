import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import { CosmosClientOptions, CosmosClient } from '@azure/cosmos'

declare module 'fastify' {
  interface FastifyInstance {
    cosmosDbClient: CosmosClient
  }
}

const getCosmosDbClientFactory = (container) => {
  const cosmosClient = new CosmosClient(options)
  // const s
};

// define plugin using callbacks
const cosmosDb: FastifyPluginCallback<CosmosClientOptions> = (fastify, options, done) => {
  if (fastify.cosmosDbClient) {
    fastify.decorate('cosmosDbClient', getCosmosDbClientFactory(options))
  }

  done()
}

export default fp(cosmosDb, '3.x')
