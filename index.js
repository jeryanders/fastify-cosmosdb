"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_plugin_1 = __importDefault(require("fastify-plugin"));
var cosmos_1 = require("@azure/cosmos");
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
var getCosmosDbClientFactory = function (options, configuration) {
    var cosmosClient = new cosmos_1.CosmosClient(options);
    var database = cosmosClient.database(configuration.databaseName);
    var containerContextPairs = configuration.containerIds.map(function (containerId) { return ([camelize(containerId), database.container(containerId)]); });
    var containerContexts = Object.fromEntries(containerContextPairs);
    return [
        database,
        containerContexts
    ];
};
// define plugin using callbacks
var cosmosDbContext = function (fastify, options, done) {
    if (fastify.cosmosDbContext) {
        var _a = getCosmosDbClientFactory(options.cosmosOptions, options.cosmosConfiguration), database = _a[0], containers = _a[1];
        fastify.decorate('cosmosDbContext', database);
        fastify.decorate('cosmosDbContainers', containers);
    }
    done();
};
exports.default = (0, fastify_plugin_1.default)(cosmosDbContext, '3.x');
