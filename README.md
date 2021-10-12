# fastify-dynamoDB

This plugin shares [@azure/cosmosdb](https://www.npmjs.com/package/@azure/cosmos) object, so you can easy use CosmmosDb with fastify.

## Install
```
npm i fastify-cosmosdb -S
```
## Usage
Add it to you project with `register` and you are done!  
You can access the *Azure CosmosClient* via `fastify.cosmosDb`.
```js
const fastify = require('fastify')

fastify.register(require('fastify-cosmosdb'), {
    endpoint: 'http://localhost:8000',
    authKey: 'some-primary-or-secondary-key'
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
    (request, reply) => (
      fastify.cosmosDb.items.create({ name: 'some-document' })
        .then((response) => response.body)
        .catch((e) => reply.send(e))
    ),
  )
}
```

## License

Licensed under [MIT](./LICENSE).
