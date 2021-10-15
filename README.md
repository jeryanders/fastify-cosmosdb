# fastify-cosmosDb

This plugin shares [@azure/cosmosdb](https://www.npmjs.com/package/@azure/cosmos) object, so you can easy use CosmmosDb with fastify.

## Install
```
npm i fastify-cosmosdb -S
```
## Usage
Register plugin with fastify. You can access the containers specified in the `cosmosConfiguration.containerIds` through the `cosmosDbContainers` decorating the fastify server: `fastify.cosmosDbContainers.containerOne.items('id')`
```js
const fastify = require('fastify')

fastify.register(require('fastify-cosmosdb'), {A
    cosmosOptions: {
      endpoint: 'http://localhost:8000',
      authKey: 'some-primary-or-secondary-key'
    },
    cosmosConfiguration: {
      databaseName: 'database-name',
      containerIds: [ 'container-one', 'container-two', 'container-three' ]
    }
  })

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

In your route file you can simply do all gets, queries, scans e.g.:

```js
async function singleRoute(fastify, options) {
  fastify.get(
    '/users/:id',
    (request, reply) => {
      // containers accessible through 'cosmosDbContainers'
      return fastify.cosmosDbContainers.containerOne.items('item-id', 'partition-key')
    },
  )
}
```

## License

Licensed under [MIT](./LICENSE).
