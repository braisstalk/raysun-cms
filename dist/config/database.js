"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
exports.default = ({ env }) => {
    const client = env('DATABASE_CLIENT', 'sqlite');
    const connections = {
        sqlite: {
            connection: {
                filename: path_1.default.join(__dirname, '..', '.tmp', env('DATABASE_FILENAME', 'data.db')),
            },
            useNullAsDefault: true,
        },
        postgres: {
            connection: {
                host: env('DATABASE_HOST', 'localhost'),
                port: env.int('DATABASE_PORT', 5432),
                database: env('DATABASE_NAME', 'strapi'),
                user: env('DATABASE_USERNAME', 'strapi'),
                password: env('DATABASE_PASSWORD', ''),
                ssl: env.bool('DATABASE_SSL', false) && {
                    rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
                },
            },
            pool: {
                min: env.int('DATABASE_POOL_MIN', 2),
                max: env.int('DATABASE_POOL_MAX', 10),
            },
        },
    };
    return {
        connection: {
            client,
            ...connections[client],
            acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
        },
    };
};
