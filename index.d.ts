/// <reference types="node" />
import { FastifyPluginCallback } from 'fastify';
import { CosmosClientOptions, Database, Container } from '@azure/cosmos';
export interface getCosmosDbClientFactory {
    (options: CosmosClientOptions, configuration: CosmosDbConfiguration): CosmosDbContext;
}
declare module 'fastify' {
    interface FastifyInstance {
        getCosmosDbClientFactory: getCosmosDbClientFactory;
        cosmosDbContext: CosmosDbContext;
        cosmosDbContainers: CosmosDbContainerContext;
    }
}
export interface CosmosDbConfiguration {
    databaseName: string;
    containerIds: string[];
}
export interface CosmosPluginOptions {
    cosmosOptions: CosmosClientOptions;
    cosmosConfiguration: CosmosDbConfiguration;
}
export interface CosmosDbContext {
    database: Database;
}
export interface CosmosDbContainerContext {
    [key: string]: Container;
}
declare const _default: FastifyPluginCallback<CosmosPluginOptions, import("http").Server>;
export default _default;
