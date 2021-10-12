import fp from 'fastify-plugin'
import { CosmosClient, CosmosClientOptions } from '@azure/cosmos'
import {FastifyInstance} from 'fastify'

function memoize (func: Function) {
  const cache = {}
  return function(n: CosmosClientOptions) {
    if (cache[n] != undefined) {
      return cache[n]
    } else {
      const result = func(n)
      cache[n] = result
      return result
    }
  }
}

let getCosmosDbClient = memoize((config: CosmosClientOptions) => (
  new CosmosClient({
    ...config,
  })
))

function cosmosDb (fastify: FastifyInstance, options = {}, done: Function) {
  const cosmosDbClient = getCosmosDbClient(options)
  if (!fastify.cosmosDb) {
    fastify.
  }
}
