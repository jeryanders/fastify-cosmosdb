import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'
import context from './context/index'

import type { CosmosPluginOptions } from './types'

// define plugin using callbacks
const cosmosDbContext: FastifyPluginCallback<CosmosPluginOptions> = (fastify, options, done) => {
  if (!fastify.cosmos) {
    return context(options)
      .then((cosmos) => {
        fastify.decorate('cosmos', cosmos)
        done()
      })
  }

  done()
}

export default fp(cosmosDbContext, '3.x')
