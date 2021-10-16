# fastify-cosmosDb

[![Node.js CI](https://github.com/jeryanders/fastify-cosmosdb/actions/workflows/node.js.yml/badge.svg)](https://github.com/jeryanders/fastify-cosmosdb/actions/workflows/node.js.yml)

This plugin shares [@azure/cosmosdb](https://www.npmjs.com/package/@azure/cosmos) object, so you can easy use CosmosDb with fastify.

## Install
```
npm i fastify-cosmosdb -S
```
## Usage
Register plugin with fastify. You can access the containers specified in the `cosmosConfiguration.containerIds` through the `cosmosDbContainers` decorating the fastify server: `fastify.cosmosDbContainers.containerOne.items('id')`. Plugin will convert all sane container labels to canonical JavaScript camelCasedNames on the main container decoration.

```js
const fastify = require('fastify')

fastify.register(require('fastify-cosmosdb'), {
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

Register your CosmosDb plugin with the following properties the `cosmosOptions` and the `cosmosConfiguration`. 

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
