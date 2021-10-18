# Fastify-cosmosDb: Your Fastify Plugin for Azure CosmosDb

This Fastify plugin interogates your CosmosDb account to determine which containers are available and provides quick access through a Fastify Instance decoration. This plugin integrates with [@azure/cosmosdb](https://www.npmjs.com/package/@azure/cosmos) and allows you to specify the database filters to opt-in account resources.

## Install
```
npm i fastify-cosmosdb -S
```
## Usage

For unfiltered access to all cosmos containers.

Configuration without database and container filters:

```js
const fastify = require('fastify')

fastify.register(require('fastify-cosmosdb'), {
    cosmosOptions: {
      endpoint: 'your-account-endpoint',
      authKey: 'auth-key'
    }
  })

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

Configuration with database and container filters:

```js
const fastify = require('fastify')

fastify.register(require('fastify-cosmosdb'), {
    cosmosOptions: {
      endpoint: 'your-account-endpoint',
      authKey: 'auth-key'
    },
    databases: [{
      id: 'database-id',
      containers: {
        'container-name': true
      }
    }]
  })

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

```js
async function singleRoute(fastify, options) {
  fastify.get(
    '/users/:id',
    (request, reply) => {
      // containers accessible through 'cosmosDbContainers'
      return fastify.cosmos.databaseId.containerName.items('item-id', 'partition-key')
    },
  )
}
```

## License

Licensed under [MIT](./LICENSE).
