# Fastify-cosmosDb: Your Fastify Plugin for Azure CosmosDb

[![Node.js CI](https://github.com/jeryanders/fastify-cosmosdb/actions/workflows/node.js.yml/badge.svg)](https://github.com/jeryanders/fastify-cosmosdb/actions/workflows/node.js.yml)

This Fastify plugin interogates your CosmosDb account to determine which containers are available and provides quick access through a Fastify Instance decoration. Currently, if interogates every database in your account. This plugin integrates with [@azure/cosmosdb](https://www.npmjs.com/package/@azure/cosmos).

## Install
```
npm i fastify-cosmosdb -S
```
## Usage


```js
const fastify = require('fastify')

fastify.register(require('fastify-cosmosdb'), CosmosClientOptions)

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
      return fastify.cosmos.someContainer.items('item-id', 'partition-key')
    },
  )
}
```

## License

Licensed under [MIT](./LICENSE).
