declare module 'context' {
  export interface initializeDatabase {
    (options: CosmosClientOptions, configuration: CosmosDbConfiguration): CosmosDbContext
  }


}
