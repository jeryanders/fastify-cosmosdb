import t from 'tap'
import fastify from 'fastify'

import fastifyCosmosDb from './index'

const test = t.test

test('fastify.cosmosDb should exist', (t) => {
  t.plan(3)

  const server = fastify()
  server.register(fastifyCosmosDb, {
    cosmosOptions: {
      endpoint: 'test-endpoint'
    },
    cosmosConfiguration: {
      databaseName: 'test-database',
      containerIds: ['camelCaseContainer', 'snake-case-container-id', 'UpperCaseContainerId']
    }
  })

  server.ready((err) => {
    t.error(err)
    t.ok(server.cosmosDbClient)
    server.close()
  })
})
